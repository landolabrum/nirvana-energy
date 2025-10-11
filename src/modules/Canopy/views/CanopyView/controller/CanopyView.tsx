import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import styles from './CanopyView.scss';

import CanopyMediaOverlay from '@Canopy/views/CanopyMediaOverlay/controller/CanopyMediaOverlay';
import useLocalStorage from '@webstack/hooks/storage/useLocalStorage';
import AdminLiveStreamOverlays from '../views/AdminLiveStreamOverlays/AdminLiveStreamOverlays';
import { getOverlayStream, LiveStreamProvider, useLiveStreamCtx } from '@Canopy/context/CanopyProvider';
import type { RosterRow } from '../../../hooks/useLiveStream';

import UiButtonGroup from '@webstack/components/UiForm/components/UiButtonGroup/controller/UiButtonGroup';

// 🔽 import canonical overlay model (single source of truth incl. `map` and `hud`)
import {
  enabledOnly,
  OVERLAY_TYPE_SET,        // Set<OverlayType> – includes 'scoreboard' | 'ticker' | 'lowerthirds' | 'map' | 'hud'
  type OverlayType,
} from '../../CanopyOverlays/canopyOverlayTypes';

import { useNotification } from '@webstack/components/Notification/Notification';
import { getService } from '@webstack/common';
import IDataBaseService from '~/src/core/services/DataBaseService/IDataBaseService';
import { useOverlayStore } from '../../../functions/overlayStore';
import useWindow from '@webstack/hooks/window/useWindow';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
// import { CanopyPanel } from '../../CanopyPanel/controller/CanopyPanel';

const LS_KEY_PREFIX = 'event_overlay:';        // LS mirror of local overlays
const LS_META_PREFIX = 'event_overlay_meta:';   // tracks seeding + edited flag + schema hash

type ScoreboardTeam = {
  id?: number;
  name?: string;
  driver?: string;
  throttleman?: string;
  place?: number;
  color?: string;
};

const sameJson = (a: unknown, b: unknown) => { try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; } };
const toNum = (v: any) => (Number.isFinite(v) ? v : Number(v));
const hash = (v: unknown) => { try { return JSON.stringify(v); } catch { return String(v); } };

function getApiBaseFromDb() {
  const db: any = getService<IDataBaseService>('IDataBaseService');
  return String(db?.baseUrl || db?.getBaseUrl?.() || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
}

type Props = { current: any; vid?: string };

/* Small, dependency-free debounce */
const useDebounced = (delay = 250) => {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const run = useCallback((fn: () => void) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => { t.current = null; fn(); }, delay);
  }, [delay]);
  useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);
  return run;
};

/**
 * Ensure only one of each configured overlay type locally (admin UX guard).
 * Server-side still authoritative, but this avoids accidental duplicates in UI.
 * Uses OVERLAY_TYPE_SET so new types (e.g. 'map', 'hud') are automatically included.
 */
function dedupeSingletonOverlays(list: any[]): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const o of list ?? []) {
    const t = String(o?.type ?? '').toLowerCase();
    if (!t) continue;
    if (OVERLAY_TYPE_SET.has(t as OverlayType)) {
      if (seen.has(t)) continue;
      seen.add(t);
    }
    out.push(o);
  }
  return out;
}


/* ================= inner view that uses the shared context ================= */

const AdminLiveStreamViewInner: React.FC<Props> = ({ current }) => {
  const eventId: string | undefined = current?.id;
  const eventName: string = current?.name ?? 'Untitled Event';

  const lsKey = eventId ? `${LS_KEY_PREFIX}${eventId}` : undefined;
  const metaKey = eventId ? `${LS_META_PREFIX}${eventId}` : undefined;

  const [, setNotification] = useNotification();

  // Store-backed overlays (authoritative for local preview)
  const { overlays, setOverlays } = useOverlayStore(eventId, current?.name);
  const active = useMemo(() => enabledOnly(overlays), [overlays]);

  // DB I/O via shared provider
  const {
    overlayStreamUrlFor,
    getOverlaysById,
    saveOverlaysById,
    loadRoster,
    roster,
    overlays: liveOverlays,
  } = useLiveStreamCtx();

  const { localItem, setLocalItem, getLocalItem } = useLocalStorage(lsKey);
  const [serverOverlays, setServerOverlays] = useState<any[] | null>(null);

  // bump a render key whenever fresh overlays arrive via SSE (kept for parity)
  const [liveKey, setLiveKey] = useState(0);
  useEffect(() => { setLiveKey((k) => k + 1); }, [JSON.stringify(liveOverlays)]);

  const seededFor = useRef<string | null>(null);
  const inSeedFlight = useRef(false);
  const [pushing, setPushing] = useState(false);

  const notify = useCallback((label: string, message: string, variant?: 'danger' | 'info' | 'success') => {
    setNotification?.({
      active: true,
      persistence: 2000,
      dismissable: true,
      list: [{ label, message }],
      ...(variant === 'danger' ? { transparent: false } : {}),
    });
  }, [setNotification]);

  /* ---------- SSE: subscribe; refresh overlays on each ping ---------- */
  useEffect(() => {
    if (!eventId) return;
    const url = overlayStreamUrlFor(eventId);
    if (!url) return;

    const unsub = getOverlayStream(eventId, url, () => {
      void getOverlaysById(eventId, { force: true });
      void loadRoster(eventId, { force: true }); // refresh roster on SSE
    });

    return unsub;
  }, [eventId, overlayStreamUrlFor, getOverlaysById, loadRoster]);

  /* ---------- helpers ---------- */
  const typeSummary = useCallback((arr: any[] | null | undefined) => {
    const list = enabledOnly(arr ?? []);
    const byType = new Map<string, number>();
    for (const o of list) {
      const t = String(o?.type ?? '').toLowerCase();
      if (!t) continue;
      byType.set(t, (byType.get(t) ?? 0) + 1);
    }
    const parts = Array.from(byType.entries()).map(([t, n]) => `${t}${n > 1 ? `×${n}` : ''}`);
    return { count: list.length, parts };
  }, []);

  /* ---------- seed LS (and Store) from server once per event ---------- */
  useEffect(() => {
    if (!eventId) { seededFor.current = null; setServerOverlays(null); return; }
    if (seededFor.current === eventId || inSeedFlight.current) return;

    inSeedFlight.current = true;
    (async () => {
      try {
        const fromServer = await getOverlaysById(eventId);
        const normalized = Array.isArray(fromServer) ? dedupeSingletonOverlays(fromServer) : [];
        setServerOverlays(normalized);

        if (lsKey && metaKey) {
          const ls = Array.isArray(localItem) ? dedupeSingletonOverlays(localItem) : [];
          const meta = (getLocalItem?.(metaKey) ?? {}) as { seedHash?: string; edited?: boolean };
          const serverHash = hash(normalized);

          const shouldReseed = (ls.length === 0) || (!meta?.edited && meta?.seedHash !== serverHash);
          if (shouldReseed) {
            setLocalItem(lsKey, normalized);
            setLocalItem(metaKey, { seedHash: serverHash, edited: false });
            setOverlays(() => normalized);

            const { count, parts } = typeSummary(normalized);
            notify('Seeded from live', `Loaded ${count} overlay(s) [${parts.join(', ')}] for “${eventName}”.`);
          } else {
            const source = ls.length ? ls : normalized;
            if (!sameJson(overlays ?? [], source)) setOverlays(() => source);
          }
        } else {
          if (!sameJson(overlays ?? [], normalized)) setOverlays(() => normalized);
        }

        seededFor.current = eventId;
      } finally {
        inSeedFlight.current = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, lsKey, metaKey]);

  /* ---------- periodic roster refresh ---------- */
  useEffect(() => {
    if (!eventId) return;
    const id = window.setInterval(() => void loadRoster(eventId, { force: true }), 15000);
    return () => window.clearInterval(id);
  }, [eventId, loadRoster]);

  /* ---------- write LS when Store changes (mark edited) ---------- */
  const debounced = useDebounced(300);
  useEffect(() => {
    if (!eventId || !lsKey || !metaKey) return;

    const list = Array.isArray(overlays) ? dedupeSingletonOverlays(overlays) : [];
    const prev = Array.isArray(localItem) ? localItem : [];

    if (!sameJson(list, prev)) {
      debounced(() => {
        setLocalItem(lsKey, list);
        const prevMeta = (getLocalItem?.(metaKey) ?? {}) as { seedHash?: string; edited?: boolean };
        setLocalItem(metaKey, { ...(prevMeta || {}), edited: true });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlays, eventId, lsKey, metaKey, localItem]);

  /* ---------- roster for scoreboard ---------- */
  useEffect(() => { if (eventId) void loadRoster(eventId); }, [eventId, loadRoster]);

  const teamsFromDb: ScoreboardTeam[] = useMemo(() => {
    const list = Array.isArray(roster) ? [...roster] : [];
    list.sort((a: RosterRow, b: RosterRow) => {
      const as = toNum((a as any).score ?? 0) || 0;
      const bs = toNum((b as any).score ?? 0) || 0;
      if (as !== bs) return as - bs;
      const av = Number(String((a as any).vehicle_number ?? '').replace(/\D+/g, '')) || 0;
      const bv = Number(String((b as any).vehicle_number ?? '').replace(/\D+/g, '')) || 0;
      if (av !== bv) return av - bv;
      return String((a as any).team_name ?? '').localeCompare(String((b as any).team_name ?? ''));
    });
    return list.map((r, i) => ({
      id: Number((r as any).vehicle_number ?? (r as any).id) || undefined,
      name: (r as any).team_name,
      driver: (r as any).driver_name ?? undefined,
      throttleman: (r as any).throttleman_name ?? (r as any).throttle_man_name ?? undefined,
      color: typeof (r as any).color === 'string' ? (r as any).color : undefined,
      place: i + 1,
    }));
  }, [roster]);

  const previewOverlays: any[] = useMemo(
    () => (Array.isArray(localItem) ? dedupeSingletonOverlays(localItem) : []),
    [localItem]
  );

  const differsFromServer = useMemo(
    () => !sameJson(previewOverlays, serverOverlays),
    [previewOverlays, serverOverlays]
  );

  /* ---------- actions ---------- */
  const typeSummaryMsg = (arr: any[] | null | undefined) => {
    const { count, parts } = typeSummary(arr ?? []);
    return `${count} overlay(s) [${parts.join(', ')}]`;
  };
  const { width } = useWindow();
  const onUndo = useCallback(() => {
    if (!lsKey) return;
    const serverList = Array.isArray(serverOverlays) ? dedupeSingletonOverlays(serverOverlays) : [];
    setLocalItem(lsKey, serverList);
    if (metaKey) setLocalItem(metaKey, { seedHash: hash(serverOverlays ?? []), edited: false });
    setOverlays(() => serverList);
    notify('Undo changes', `Reverted overlays for “${eventName}”. Live now: ${typeSummaryMsg(serverOverlays)}.`);
  }, [lsKey, metaKey, serverOverlays, setLocalItem, setOverlays, notify, eventName]);

  const onGoLive = useCallback(async () => {
    if (!eventId || pushing) return;
    setPushing(true);

    const publishList = dedupeSingletonOverlays(previewOverlays);
    try {
      const ok = await saveOverlaysById(eventId, publishList);
      if (ok) {
        setServerOverlays(publishList);
        if (metaKey) setLocalItem(metaKey, { seedHash: hash(publishList), edited: true });
        setOverlays(() => publishList);

        // Immediate refresh for our own Live pane
        await getOverlaysById(eventId, { force: true });

        // Nudge other clients (overlay page refresh)
        const apiBase = getApiBaseFromDb();
        if (apiBase) {
          try {
            await fetch(`${apiBase}/api/db/overlay_ping?event_id=${encodeURIComponent(String(eventId))}`, {
              method: 'POST',
              keepalive: true,
            });
          } catch { /* non-critical */ }
        }

        notify('Published to live', `Pushed overlays for “${eventName}”. ${typeSummaryMsg(publishList)}.`);
      } else {
        notify('Push failed', 'Could not save overlays to server (no changes were applied).', 'danger');
      }
    } finally {
      setPushing(false);
    }
  }, [eventId, pushing, previewOverlays, saveOverlaysById, metaKey, setLocalItem, setOverlays, notify, eventName, getOverlaysById]);
const canUndo = differsFromServer && !pushing && Boolean(eventId);
const canPush = differsFromServer && !pushing && Boolean(eventId) && previewOverlays.length > 0;
  const handleSelect = useCallback((a: any, b?: any) => {
    const extractName = (x: any, y: any): string | undefined => {
      if (typeof x === 'string') return x;
      if (typeof y === 'string') return y;
      return (
        x?.name ??
        x?.detail?.name ??
        x?.detail?.value ??
        x?.target?.name ??
        x?.target?.dataset?.name ??
        x?.currentTarget?.name ??
        x?.currentTarget?.dataset?.name ??
        y?.name ??
        y?.detail?.name ??
        y?.detail?.value
      );
    };
    const raw = extractName(a, b);
    if (!raw) return;
    const name = String(raw).toLowerCase();

    if (name === 'undo') {
      if (!differsFromServer || !eventId || pushing) return;
      onUndo();
      return;
    }
    if (name === 'push') {
      if (!eventId || pushing) return;
      onGoLive();
      return;
    }
  }, [differsFromServer, eventId, pushing, onUndo, onGoLive]);

  /* ---------- render ---------- */
  return (
    <>
    
      <style jsx>{styles}</style>
      <div className="admin-live-stream-view">
        <div className="admin-live-stream-view__display">
          {eventId ? (
            <>
              <section className="alsv__local" aria-label="local-preview">
                <legend>preview</legend>
                <CanopyMediaOverlay
                  fullScreen={false}
                  eventId={eventId}
                  source="local"           // purely local; no DB in this pane
                  teamsOverride={teamsFromDb}
                />
              </section>

              <div className="admin-live-stream-view__controls">
                    <UiIcon  
                    height={25}
                    color={canUndo?"vaar(--gray-30)":"var(--gray-90)"}
                    alt="undo" icon={pushing ? 'fa-spinner fa-spin' : 'fa-rotate-left'} onClick={() => {
                      handleSelect({ name: 'undo', })
                      
                    }} />

                    <UiIcon 
                    height={25}
                    alt="Push Live"
                    glow={canPush}
                    color={canPush?"var(--blue-10)":"var(--gray-90)"}
                      icon={pushing ? 'spinner' : 'fa-chevron-right'} onClick={() => {
                      handleSelect({ name: 'push', })
                    }} />
              </div>

              <section className="alsv__server" aria-label="server-preview">
                <legend>live</legend>
                <CanopyMediaOverlay
                  fullScreen={false}
                  eventId={eventId}
                  source="local"                 // feed overlays directly here
                  overlays={liveOverlays ?? []}  // ← always an array
                  pollMs={0}
                  useSSE={false}
                  teamsOverride={teamsFromDb}
                  suppressEmptyPlaceholder       // ← hide placeholder when empty
                />
              </section>
            </>
          ) : (
            <div />
          )}
        </div>

        <AdminLiveStreamOverlays current={current as any} overlays={active} variant="preview" />
      </div>
    </>
  );
};

/* ================= exported component: wraps with the Provider ================= */

const AdminLiveStreamView: React.FC<Props> = (props) => {
  const eid = props.current?.id;
  return (
    <LiveStreamProvider eventId={eid} prefetchRoster prefetchOverlays>
      <AdminLiveStreamViewInner {...props} />
    </LiveStreamProvider>
  );
};

export default AdminLiveStreamView;

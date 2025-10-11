import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './AdminLiveStreamOverlays.scss';

import UiForm from '@webstack/components/UiForm/controller/UiForm';
import type { IFormField } from '@webstack/components/UiForm/models/IFormModel';

import { AdminLiveStreamScoreBoardControls } from '../AdminLiveStreamScoreBoardControls/AdminLiveStreamScoreBoardControls';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import LiveStreamTickerControls from '../../../forms/AdminLiveStreamTickerForm/AdminLiveStreamTickerForm';
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';

import {
  defaultOverlayFor,
  OverlayType,
  CanonOverlay,
  enabledOnly,
  overlayFieldsFor,
} from '@Canopy/views/CanopyOverlays/canopyOverlayTypes';

import { useOverlayStore } from '@Canopy/functions/overlayStore';
import useLocalStorage from '@webstack/hooks/storage/useLocalStorage';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useLiveStreamCtx } from '@Canopy/context/CanopyProvider';
import { TeamOption, CanopyTeamPicker } from '../../../forms/CanopyTeamPicker/CanopyTeamPicker';
import { useTeamGpsByVehicleNumber } from '../../../../hooks/useTeamGPS';

/* ================= types ================= */

type EventRow = {
  id: string;
  name: string;
  overlays?: any[];
  lat?: number | null;
  lng?: number | null;
};

type Props = {
  current: EventRow | null;
  overlays?: CanonOverlay[] | null;
  variant?: 'preview' | 'live';
};

/* ================= helpers ================= */

const LS_OVERLAY_PREFIX = 'event_overlay:' as const;

const clamp01 = (n: any) => Math.min(100, Math.max(0, Number(n) || 0));
const toFloatOrUndef = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const setDeep = <T extends Record<string, any>>(obj: T, path: string, value: any): T => {
  if (!path || path.indexOf('.') === -1) return { ...(obj as any), [path || 'value']: value };
  const parts = path.split('.');
  const last = parts.pop() as string;
  const root: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  let cursor = root;
  for (const key of parts) {
    const current = cursor[key];
    const next = Array.isArray(current) ? [...current] : { ...(current || {}) };
    cursor[key] = next;
    cursor = next;
  }
  cursor[last] = value;
  return root as T;
};

const pickValue = (raw: any) =>
  raw && typeof raw === 'object' && 'value' in raw ? (raw as any).value : raw;

/* ================= component ================= */

const AdminLiveStreamOverlays: React.FC<Props> = ({ current, overlays: injected, variant = 'preview' }) => {
  const eventId = current?.id ? String(current.id) : undefined;
  const lsKey = eventId ? `${LS_OVERLAY_PREFIX}${eventId}` : undefined;

  const { overlays, setOverlays } = useOverlayStore(eventId, current?.name);
  const { setLocalItem } = useLocalStorage(lsKey);
  const { roster } = useLiveStreamCtx();

  // choose source: injected overlays (if provided) or store overlays
  const source = injected ?? overlays;

  // full list (no filtering) – used for editing so fields don't reset
  const allOverlays = useMemo<CanonOverlay[]>(
    () => (Array.isArray(source) ? source : []),
    [source]
  );

  // enabled-only – used for showing which groups are active
  const active = useMemo(() => enabledOnly(source ?? []), [source]);

  // fetch overlay by type from the full list, fall back to default once
  const ov = useCallback(
    (t: OverlayType): CanonOverlay =>
      allOverlays.find((r) => r.type === t) ?? defaultOverlayFor(t, current?.name),
    [allOverlays, current?.name]
  );

  const eventCenter = useMemo(
    () => ({ lat: toFloatOrUndef(current?.lat), lng: toFloatOrUndef(current?.lng) }),
    [current?.lat, current?.lng]
  );

  // seed map center from event once per event change (only if empty)
  useEffect(() => {
    if (!eventId) return;
    const m = allOverlays.find(o => o.type === 'map');
    const hasCenter =
      toFloatOrUndef(m?.data?.lat) != null &&
      toFloatOrUndef(m?.data?.lng) != null;

    if (!hasCenter && eventCenter.lat != null && eventCenter.lng != null) {
      patch('map', 'data.lat', eventCenter.lat);
      patch('map', 'data.lng', eventCenter.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const patch = useCallback(
    (type: OverlayType, name: string, value: any) => {
      setOverlays((prev) => {
        const list = Array.isArray(prev) ? [...prev] : [];
        const idx = list.findIndex((o) => o.type === type);
        const base = idx >= 0 ? list[idx] : defaultOverlayFor(type, current?.name);

        const nextVal = (() => {
          if (name === 'x' || name === 'y') return clamp01(value);
          if (name === 'z_index' || name === 'delay_ms') return Number(value) || 0;
          if (name.startsWith('data.')) return value;
          if (name === 'title' || name === 'description' || name === 'icon' || name === 'link') return String(value ?? '');
          return value;
        })();

        const updated =
          name.startsWith('data.')
            ? setDeep(base, name, nextVal)
            : { ...base, [name]: nextVal };

        // keep existing enabled flag if overlay existed
        const final: CanonOverlay = { ...updated, enabled: base.enabled !== false };

        const next = list.slice();
        if (idx >= 0) next[idx] = final;
        else next.push(final);

        if (lsKey) setLocalItem(lsKey, next);
        return next;
      });
    },
    [setOverlays, current?.name, lsKey, setLocalItem]
  );

  const onChangeFor = useCallback(
    (type: OverlayType) => (e: any) => {
      if (Array.isArray(e)) { patch(type, 'data.items', e); return; }
      const t = e?.target ?? e;
      const name: string | undefined = t?.name;
      if (!name) return;

      const inputType = t?.type;
      const rawVal = inputType === 'checkbox' ? !!t?.checked : t?.value;
      const val = pickValue(rawVal);

      // map-only helpers
      if (type === 'map' && name === 'data.manualCenter') {
        patch('map', name, !!val);
        return;
      }
      if (type === 'map' && (name === 'data.address' || name.endsWith('.address'))) {
        if (val && typeof val === 'object') {
          const lat = toFloatOrUndef((val as any).lat);
          const lng = toFloatOrUndef((val as any).lng);
          if (lat != null) patch('map', 'data.lat', lat);
          if (lng != null) patch('map', 'data.lng', lng);
        }
        patch('map', name, val);
        return;
      }

      // default
      patch(type, name, val);
    },
    [patch]
  );

  const onChangeTicker = useCallback((e: any) => onChangeFor('ticker')(e), [onChangeFor]);

  const onAddTickerField = useCallback(
    (e: any) => {
      const raw = String(e?.target?.value ?? '').trim();
      if (!raw) return;
      setOverlays((prev) => {
        const list = Array.isArray(prev) ? [...prev] : [];
        const idx = list.findIndex((o) => o.type === 'ticker');
        const base = idx >= 0 ? list[idx] : defaultOverlayFor('ticker', current?.name);
        const cur: string[] = Array.isArray(base?.data?.items) ? base.data.items : [];
        if (cur.includes(raw)) return prev;

        const updated = setDeep(base, 'data.items', [...cur, raw]);

        const next = list.slice();
        next[idx >= 0 ? idx : next.length] = updated;

        if (lsKey) setLocalItem(lsKey, next);
        return next;
      });
    },
    [setOverlays, current?.name, lsKey, setLocalItem]
  );

  const [grLout, setGridLayout] = useState(true);
  const showScoreboard = active.some((r) => r.type === 'scoreboard');
  const showTicker = active.some((r) => r.type === 'ticker');
  const showLowerThirds = active.some((r) => r.type === 'lowerthirds');
  const showMap = active.some((r) => r.type === 'map');
  const showHud = active.some((r) => r.type === 'hud');

  /* ---------- Build Team options & GPS availability ---------- */
  // Current selected team numbers from the map overlay
  const mapSelected: string[] = useMemo(() => {
    const m = allOverlays.find(o => o.type === 'map');
    const arr = m?.data?.team_numbers;
    return Array.isArray(arr) ? arr.map((x: any) => String(x)) : [];
  }, [allOverlays]);

  // Get live GPS for *potential* vehicles (from roster); the hook needs a list of vehicle_numbers
  const rosterVehicles = useMemo(
    () => (Array.isArray(roster) ? roster : [])
            .map((r: any) => r?.vehicle_number ?? r?.number ?? r?.id)
            .filter(Boolean)
            .map((v: any) => String(v)),
    [roster]
  );

  // Pull GPS (map-like API with get(vehicle) -> "lat,lng" or undefined)
  const gps = useTeamGpsByVehicleNumber(eventId, rosterVehicles, 3000);

  // Build options; mark hasGps based on gps.get(vehicle) truthiness
  const teamOptions: TeamOption[] = useMemo(() => {
    const rs = Array.isArray(roster) ? roster : [];
    return rs
      .map((r: any) => {
        const vehicle = String(r.vehicle_number ?? r.number ?? r.id ?? '');
        if (!vehicle) return null;
        const hasGps = Boolean(gps.get?.(vehicle));
        return {
          id: String(r.id ?? r.team_id ?? vehicle),
          label: String(r.team_name ?? r.name ?? 'Unnamed'),
          vehicle,
          hasGps,
        } as TeamOption;
      })
      .filter(Boolean) as TeamOption[];
  }, [roster, gps]);

  const toggleTeam = useCallback((veh: string) => {
    const set = new Set(mapSelected);
    if (set.has(veh)) set.delete(veh); else set.add(veh);
    patch('map', 'data.team_numbers', Array.from(set));
  }, [mapSelected, patch]);

  const selectAllTeams = useCallback(() => {
    // Only select teams with live GPS
    const allWithGps = teamOptions.filter(o => o.hasGps).map(o => o.vehicle);
    patch('map', 'data.team_numbers', allWithGps);
  }, [teamOptions, patch]);

  const clearTeams = useCallback(() => {
    patch('map', 'data.team_numbers', []);
  }, [patch]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-live-stream-add-overlay">
        {!eventId && <div className="form__hint">Select an event to manage overlays.</div>}
        {eventId && (
          <>
            <div className='d-flex s-5 justify-between g-1'>
              <h1>Overlay Controls</h1>
              <div className='d-flex s-100 justify-end g-4'>
                <div><UiIcon icon="fa-list" onClick={() => setGridLayout(true)} /></div>
                <UiIcon color={grLout ? "white" : ''} onClick={() => setGridLayout(false)} icon="fa-grid" />
              </div>
            </div>

            <div className="admin-live-stream-add-overlay--list">
              <AdaptGrid xs={1} xl={grLout ? 1 : 2} xxl={grLout ? 1 : 4} gapX={10} gapY={7}>
                {showScoreboard && (
                  <>
                    {/* <UiCollapse id="control-scoreboard" label="TEAM ROSTER"> */}
                      <div className='s-w-100 d-flex-col'>
                        <AdminLiveStreamScoreBoardControls current={current} />
                      </div>
                    {/* </UiCollapse> */}
                    <UiCollapse id="edit-scoreboard" label="scoreboard overlay">
                      <div style={{ minHeight: "max-content", paddingBottom: "50px", position: "relative" }}>
                        <UiForm
                          title="Scoreboard"
                          fields={overlayFieldsFor('scoreboard', ov('scoreboard')) as IFormField[]}
                          onChange={onChangeFor('scoreboard')}
                        />
                      </div>
                    </UiCollapse>
                  </>
                )}

                {showTicker && (
                  <UiCollapse id="edit-ticker" label="ticker overlay">
                    <LiveStreamTickerControls
                      eventName={current?.name}
                      overlay={ov('ticker') as any}
                      onChange={onChangeTicker}
                      onAddField={onAddTickerField}
                    />
                  </UiCollapse>
                )}

                {showLowerThirds && (
                  <UiCollapse id="edit-l3" open label="lower thirds overlay">
                    <>
                      <div>
                        <UiButton target="_blank" rel="noopener noreferrer" variant="link" href="https://www.markdownguide.org/cheat-sheet/">
                          markdown cheatsheet
                        </UiButton>
                      </div>
                      <UiForm
                        title="Lower Thirds"
                        fields={overlayFieldsFor('lowerthirds', ov('lowerthirds')) as IFormField[]}
                        onChange={onChangeFor('lowerthirds')}
                      />
                    </>
                  </UiCollapse>
                )}

                {showMap && (
                  <UiCollapse id="edit-map" open label="map overlay">
                    <>
                      <UiForm
                        title="Map"
                        fields={overlayFieldsFor('map', ov('map'), { eventDefaults: eventCenter }) as IFormField[]}
                        onChange={onChangeFor('map')}
                      />

                      {/* Team selection (UiSelect-based via TeamPicker) */}
                      <div className="form__hint" style={{ marginTop: 8 }}>
                        Select teams to show live GPS markers:
                      </div>

                      <CanopyTeamPicker
                        options={teamOptions}
                        selected={mapSelected}
                        onToggle={toggleTeam}
                        onAll={selectAllTeams}
                        onClear={clearTeams}
                        hideTeamsWithoutGps={true} // 🚫 hide non-GPS teams in dropdown
                      />
                    </>
                  </UiCollapse>
                )}

                {showHud && (
                  <UiCollapse id="edit-hud" open label="hud overlay">
                    <>
                      <UiForm
                        title="HUD"
                        fields={overlayFieldsFor('hud', ov('hud')) as IFormField[]}
                        onChange={onChangeFor('hud')}
                      />
                      <div className="form__hint" style={{ marginTop: 8 }}>
                        Set <b>Team (boat #)</b> to auto-fill Latitude/Longitude from live GPS. Leave it blank to use manual coordinates.
                      </div>
                    </>
                  </UiCollapse>
                )}

                {active.length === 0 && (
                  <div className="form__hint">
                    No overlays are enabled for this event. Toggle them on in the left panel.
                  </div>
                )}
              </AdaptGrid>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminLiveStreamOverlays;

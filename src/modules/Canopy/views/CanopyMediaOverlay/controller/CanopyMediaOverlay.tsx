import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./CanopyMediaOverlay.scss";

import OverlayScoreBoard from "../views/OverlayScoreBoard/OverlayScoreBoard";
import OverlayTicker from "../views/OverlayTicker/OverlayTicker";
import OverlayL3 from "../views/OverlayL3/OverlayL3";
import OverlayCourseMap from "../views/OverlayCourseMap/OverlayCourseMap";
import OverlayHud from "../views/OverlayHud/OverlayHud";
import { useOverlayStore } from "@Canopy/functions/overlayStore";
import { getService } from "@webstack/common";
import IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";

import {
  normalizeOverlayArray,
  type CanonOverlay,
  jsonStable,
} from "@Canopy/views/CanopyOverlays/canopyOverlayTypes";

import { useTeamGpsByVehicleNumber } from "../../../hooks/useTeamGPS";

import {
  // geo
  parseGps,
  calculateSpeedMph,
  type GpsSample,
  // overlay helpers
  parseOverlays,
  rowsToCanon,
  getApiBaseFromDb,
  enabledOnlyLocal,
  coerceTeams,
  normType,
  clamp01,
  anchorShift,
} from "@Canopy/utils";

/* ---------- types ---------- */
type Team = {
  id?: number | string;
  name?: string;
  driver?: string;
  throttleman?: string;
  place?: number;
  score?: number;
  color?: string;
  gps?: string;
  speedMph?: number;
};
type Overlay = CanonOverlay;
type SourceMode = "prop" | "local" | "server";

/* ---------- design constants ---------- */
const DESIGN_H = 1080;
const DESIGN_W = 1920;

/* ---------- title adapters (fix TS2322 with stricter child props) ---------- */
import type { TitleInput as ScoreTitle } from "../views/OverlayScoreBoard/OverlayScoreBoard";
import type { TitleLike as L3TitleLike } from "../views/OverlayL3/OverlayL3";

const toScoreTitle = (v: unknown): ScoreTitle | undefined => {
  if (v == null) return undefined;
  if (typeof v === "string") return v as ScoreTitle;
  if (typeof v === "object" && ("text" in (v as any) || "img" in (v as any))) {
    return v as ScoreTitle;
  }
  return { text: String(v) } as ScoreTitle;
};

const toL3TitleLike = (v: unknown): L3TitleLike | undefined => {
  if (v == null) return undefined;
  if (typeof v === "string") return v as L3TitleLike;
  if (typeof v === "object" && ("text" in (v as any) || "img" in (v as any))) {
    return v as L3TitleLike;
  }
  return String(v) as unknown as L3TitleLike;
};

/* ---------- stable id + stable key helpers ---------- */

/** Create a deterministic signature for an overlay when DB id is absent */
function idSignature(o: Overlay): string {
  // Type + variant + title/description establish identity across sessions
  const t = normType(o?.type);
  const v = String(o?.variant ?? "default");
  // use string forms; avoid dumping large data payloads
  const title = typeof o?.title === "string" ? o.title : "";
  const desc = typeof o?.description === "string" ? o.description : "";
  return `${t}::${v}::${title}::${desc}`;
}

/**
 * Ensure each overlay has a stable `id`.
 * - If incoming row already has `id`, keep it.
 * - If not, synthesize a deterministic id per signature, stable across reloads.
 */
function ensureStableIds(input: Overlay[] | null | undefined): Overlay[] {
  if (!Array.isArray(input)) return [];
  const bySig = new Map<string, string>();
  let syntheticCounter = 1;

  return input.map((o) => {
    if (o.id != null && `${o.id}` !== "") return o;
    const sig = idSignature(o);
    let id = bySig.get(sig);
    if (!id) {
      id = `ov-${sig}-${syntheticCounter++}`;
      bySig.set(sig, id);
    }
    return { ...o, id };
  });
}

/** Per-instance stable key cache so position/z changes do not remount nodes */
function useStableKey() {
  const ref = useRef<Map<string, string>>(new Map());
  return (ov: Overlay) => {
    if (ov.id != null && `${ov.id}` !== "") return String(ov.id);
    const basis = idSignature(ov);
    let k = ref.current.get(basis);
    if (!k) {
      k = `${basis}#${ref.current.size + 1}`;
      ref.current.set(basis, k);
    }
    return k;
  };
}

/* =========================================================================================
   Component
   ========================================================================================= */

const CanopyMediaOverlay: React.FC<{
  overlays?: Overlay[] | null | undefined;
  eventId?: string | number;
  source?: SourceMode;
  pollMs?: number;
  useSSE?: boolean;
  fullScreen?: boolean;
  x?: number;
  y?: number;
  teamsOverride?: Team[];
  appendTeamsOverride?: boolean;
  suppressEmptyPlaceholder?: boolean;
}> = ({
  overlays,
  eventId,
  source,
  pollMs,
  useSSE = true,
  fullScreen = true,
  teamsOverride,
  appendTeamsOverride = false,
  suppressEmptyPlaceholder = true,
}) => {
  /* ---------- choose source ---------- */
  const effectiveSource: SourceMode = useMemo<SourceMode>(() => {
    if (overlays !== undefined) return "prop";
    if (eventId != null) return source ?? "local";
    return "prop";
  }, [overlays, eventId, source]);

  const { overlays: localOverlays } = useOverlayStore(
    eventId != null ? String(eventId) : undefined,
    undefined
  );

  const db = useMemo(
    () =>
      effectiveSource === "server"
        ? getService<IDataBaseService>("IDataBaseService")
        : null,
    [effectiveSource]
  );

  const [serverOverlays, setServerOverlays] = useState<Overlay[]>([]);
  const serverSigRef = useRef<string>("");

  const setServerOverlaysIfChanged = useCallback((next: Overlay[]) => {
    const sig = jsonStable(next);
    if (sig !== serverSigRef.current) {
      serverSigRef.current = sig;
      setServerOverlays(next);
    }
  }, []);

  const fetchServerOverlays = useCallback(
    async (eid: string | number | null) => {
      if (!db || !eid) return;
      try {
        const res = await db.selectData({
          tableName: "livestream_event_overlay",
          where: { exact: { event_id: eid } },
        });

        const rows = Array.isArray(res?.data) ? res.data : [];
        let canon: Overlay[] = [];

        if (rows.length > 0) {
          const first = rows[0] || {};
          if (first.state != null) {
            const raw = parseOverlays(first.state);
            canon = normalizeOverlayArray(raw) as Overlay[];
          } else if (first.type != null || rows.length > 1) {
            canon = normalizeOverlayArray(rowsToCanon(rows)) as Overlay[];
          }
        }

        // Normalize IDs before storing
        setServerOverlaysIfChanged(ensureStableIds(canon));
      } catch {
        /* keep last good state */
      }
    },
    [db, setServerOverlaysIfChanged]
  );

  /* ---------- live updates (SSE or poll) ---------- */
  useEffect(() => {
    if (effectiveSource !== "server" || !eventId || !useSSE) return;

    const eid = String(eventId);
    const url =
      (db as any)?.overlayStreamUrl?.(eid) ||
      `${getApiBaseFromDb()}/api/db/overlay_stream?event_id=${encodeURIComponent(
        eid
      )}`;

    const es = new EventSource(url);
    const onOverlay = () => void fetchServerOverlays(eid);

    es.addEventListener("overlay", onOverlay as unknown as EventListener);
    es.onerror = () => {};

    void fetchServerOverlays(eid);

    return () => {
      es.removeEventListener("overlay", onOverlay as unknown as EventListener);
      es.close();
    };
  }, [effectiveSource, eventId, useSSE, fetchServerOverlays, db]);

  useEffect(() => {
    if (effectiveSource !== "server") return;
    void fetchServerOverlays(eventId ?? null);
  }, [effectiveSource, eventId, fetchServerOverlays]);

  useEffect(() => {
    if (effectiveSource !== "server" || !eventId) return;
    if (useSSE) return;

    const ms = Math.max(10000, pollMs ?? 15000);
    const id = window.setInterval(() => void fetchServerOverlays(eventId), ms);
    return () => window.clearInterval(id);
  }, [effectiveSource, eventId, pollMs, useSSE, fetchServerOverlays]);

  /* ---------- choose + normalize list from source ---------- */
  const listRaw: Overlay[] = useMemo(() => {
    if (effectiveSource === "prop") return Array.isArray(overlays) ? overlays : [];
    if (effectiveSource === "server") return serverOverlays;
    return Array.isArray(localOverlays) ? localOverlays : [];
  }, [effectiveSource, overlays, serverOverlays, localOverlays]);

  // Normalize IDs for any non-server source too
  const list = useMemo(() => ensureStableIds(listRaw), [listRaw]);

  /* ---------- enabled overlays ---------- */
  const enabled = useMemo(() => enabledOnlyLocal(list), [list]);

  const groups = useMemo(() => {
    const scoreboards = enabled.filter((o) => normType(o.type) === "scoreboard");
    const ticker = enabled.filter((o) => normType(o.type) === "ticker");
    const lowerthirds = enabled.filter((o) => normType(o.type) === "lowerthirds");
    const maps = enabled.filter((o) => normType(o.type) === "map");
    const other = enabled.filter(
      (o) =>
        !["scoreboard", "ticker", "lowerthirds", "map"].includes(
          normType(o.type)
        )
    ); // 'hud' lands here
    return { scoreboards, ticker, lowerthirds, maps, other };
  }, [enabled]);

  const primaryScore = groups.scoreboards[0];

  /* ---------- base teams (overlay + override) ---------- */
  const baseTeams = useMemo<Team[]>(() => {
    const overlayTeams = coerceTeams(primaryScore?.data?.teams);
    const fallback = Array.isArray(teamsOverride) ? coerceTeams(teamsOverride) : [];
    if (!appendTeamsOverride) return overlayTeams.length ? overlayTeams : fallback;
    if (!overlayTeams.length) return fallback;

    const key = (t: Team) =>
      t?.id != null ? `#${t.id}` : (t?.name ?? "").toLowerCase().trim();
    const seen = new Set(overlayTeams.map(key).filter(Boolean));
    const extra = fallback.filter((t) => {
      const k = key(t);
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    return extra.length ? [...overlayTeams, ...extra] : overlayTeams;
  }, [primaryScore?.data?.teams, teamsOverride, appendTeamsOverride]);

  /* ---------- numbers requiring GPS ---------- */
  const scoreboardNumbers = useMemo(
    () =>
      baseTeams
        .map((t) => (t?.id != null ? String(t.id) : ""))
        .filter(Boolean),
    [baseTeams]
  );

  const mapNumbers = useMemo(() => {
    const nums = new Set<string>();
    for (const m of groups.maps) {
      const arr = Array.isArray((m as any)?.data?.team_numbers)
        ? ((m as any).data.team_numbers as any[])
        : [];
      for (const n of arr) {
        const s = String(n);
        if (s) nums.add(s);
      }
    }
    return Array.from(nums);
  }, [groups.maps]);

  const hudNumbers = useMemo(() => {
    const nums = new Set<string>();
    for (const h of enabled) {
      if (normType(h?.type) !== "hud") continue;
      const tn = (h as any)?.data?.team_number;
      const s = tn != null ? String(tn) : "";
      if (s) nums.add(s);
    }
    return Array.from(nums);
  }, [enabled]);

  const allWantedNumbers = useMemo(() => {
    const s = new Set<string>(scoreboardNumbers);
    for (const n of mapNumbers) s.add(n);
    for (const n of hudNumbers) s.add(n);
    return Array.from(s);
  }, [scoreboardNumbers, mapNumbers, hudNumbers]);

  /* ---------- live GPS ---------- */
  const gps = useTeamGpsByVehicleNumber(eventId, allWantedNumbers, 3000);
  const lastGpsSamplesRef = useRef<Map<string, GpsSample>>(new Map());
  const lastSpeedRef = useRef<Map<string, number>>(new Map());
  const gpsGet = gps.get;

  /* ---------- merge GPS into teams ---------- */
  const teams = useMemo<Team[]>(
    () => {
      const samples = lastGpsSamplesRef.current;
      const speeds = lastSpeedRef.current;
      const seen = new Set<string>();
      const now = Date.now();

      const mapped = baseTeams.map((team) => {
        const idRaw = team?.id;
        if (idRaw == null) return team;

        const key = String(idRaw);
        const gpsValue = gpsGet(key);
        if (!gpsValue) {
          samples.delete(key);
          speeds.delete(key);
          return { ...team, gps: undefined, speedMph: undefined };
        }

        const coords = parseGps(gpsValue);
        if (!coords) {
          samples.delete(key);
          speeds.delete(key);
          seen.add(key);
          return { ...team, gps: gpsValue, speedMph: undefined };
        }

        const sample: GpsSample = { ...coords, timestamp: now };
        const prev = samples.get(key);
        const computedSpeed = calculateSpeedMph(prev, sample);
        if (computedSpeed !== undefined) {
          speeds.set(key, computedSpeed);
        }

        samples.set(key, sample);
        seen.add(key);

        return {
          ...team,
          gps: gpsValue,
          speedMph: speeds.get(key),
        };
      });

      for (const key of Array.from(samples.keys())) {
        if (!seen.has(key)) {
          samples.delete(key);
          speeds.delete(key);
        }
      }

      return mapped;
    },
    [baseTeams, gps.map, gpsGet]
  );

  /* ---------- layout scaler ---------- */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recalc = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const s = Math.min(rect.width / DESIGN_W, rect.height / DESIGN_H);
      setScale(Number.isFinite(s) && s > 0 ? s : 1);
    };

    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    window.addEventListener("resize", recalc);
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(recalc);
      (recalc as any)._r2 = r2;
    });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
      cancelAnimationFrame(r1);
      if ((recalc as any)._r2) cancelAnimationFrame((recalc as any)._r2);
    };
  }, [fullScreen, enabled.length]);

  /* ---------- per-overlay render ---------- */

  const getStableKey = useStableKey();

  const renderOverlay = (o: Overlay) => {
    const t = normType(o.type);

    if (t === "scoreboard") {
      return (
        <OverlayScoreBoard
          title={toScoreTitle(o.title ?? o.description)}
          subTitle={o.description}
          data={{ teams }}
          fullScreen={false}
        />
      );
    }

    if (t === "ticker") {
      return <OverlayTicker items={(o as any)?.data?.items ?? []} />;
    }

    if (t === "lowerthirds") {
      return (
        <OverlayL3
          title={toL3TitleLike(o.title ?? o.description)}
          description={toL3TitleLike(o.description)}
          data={{ teams }}
          items={(o as any)?.data?.items ?? []}
          variant={(o as any).variant ?? "default"}
          link_url={(o as any)?.link}
        />
      );
    }

    if (t === "map") {
      const d = ((o as any)?.data ?? {}) as any;

      const selectedNums: string[] = Array.isArray(d?.team_numbers)
        ? d.team_numbers.map((x: any) => String(x))
        : [];

      const mphByNum = new Map<string, number | undefined>(
        teams.map((tm) => [String(tm.id ?? ""), tm.speedMph])
      );

      const gpsMarkers =
        selectedNums
          .map((num) => {
            const fix = gps.get(num);
            if (!fix) return null;

            const [latS, lonS] = String(fix).split(",").map((s) => s.trim());
            const lat = Number(latS);
            const lon = Number(lonS);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

            const speedMph = mphByNum.get(num);
            const speed_mps =
              typeof speedMph === "number" && Number.isFinite(speedMph)
                ? speedMph / 2.23693629
                : undefined;

            return {
              id: `boat-${num}`,
              lngLat: [lon, lat] as [number, number],
              label: num,
              speed_mps,
            };
          })
          .filter(Boolean) as Array<{
            id: string;
            lngLat: [number, number];
            label: string;
            speed_mps?: number;
          }>;

      const manualMarkers = Array.isArray(d?.markers) ? d.markers : [];
      const markers = [...manualMarkers, ...gpsMarkers];

      const center =
        d?.manualCenter && Number.isFinite(d?.lng) && Number.isFinite(d?.lat)
          ? ([Number(d.lng), Number(d.lat)] as [number, number])
          : Array.isArray(d?.lngLat)
          ? (d.lngLat as [number, number])
          : gpsMarkers[0]?.lngLat ?? undefined;

      return (
        <OverlayCourseMap
          course={{
            center: center ?? undefined,
            zoom: typeof d?.zoom === "number" ? d.zoom : undefined,
            pitch: typeof d?.pitch === "number" ? d.pitch : 45,
            markers,
          }}
        />
      );
    }

    if (t === "hud") {
      const requestedVeh = (o as any)?.data?.team_number
        ? String((o as any).data.team_number)
        : undefined;

      const coords =
        (requestedVeh && gps.get(requestedVeh)) ||
        (Array.from(gps.map.values())[0] ?? "");

      const [latS, lonS] = String(coords).split(",").map((s) => s.trim());

      const gpsData =
        latS && lonS
          ? {
              lat: parseFloat(latS),
              lon: parseFloat(lonS),
              timestamp: new Date().toISOString(),
              vehicle: requestedVeh,
            }
          : undefined;

      return <OverlayHud gpsData={gpsData} />;
    }

    return null;
  };

  const renderables = useMemo(() => {
    const restScoreboards = groups.scoreboards.slice(1);
    return [
      ...(primaryScore ? [primaryScore] : []),
      ...restScoreboards,
      ...groups.ticker,
      ...groups.lowerthirds,
      ...groups.maps,
      ...groups.other, // includes HUD
    ].sort((a, b) => Number(b?.z_index ?? 0) - Number(a?.z_index ?? 0));
  }, [groups, primaryScore]);

  /* ---------- component ---------- */
  return (
    <>
      <style jsx>{styles}</style>
      <div
        ref={containerRef}
        className="ui-media-overlay"
        data-fullscreen={fullScreen ? "true" : "false"}
      >
        <div
          className="ui-media-overlay__surface"
          style={{ transform: `scale(${scale})` }}
        >
          {!renderables.length && !suppressEmptyPlaceholder && (
            <div className="ui-media-overlay__empty">no overlays</div>
          )}

          {renderables.map((ov) => {
            const leftPx = (clamp01(ov.x ?? 0) / 100) * DESIGN_W;
            const topPx = (clamp01(ov.y ?? 0) / 100) * DESIGN_H;

            const tx = anchorShift(ov.x);
            const ty = anchorShift(ov.y);
            const t = normType(ov.type);
            const variant = String(ov.variant ?? "default");

            const base: React.CSSProperties = { zIndex: Number(ov?.z_index ?? 0) };

            if (t === "ticker") {
              base.left = 0;
              base.top = `${topPx}px`;
              base.width = `${DESIGN_W}px`;
              base.transform = ty ? `translate(0, ${ty}%)` : undefined;
            } else if (t === "lowerthirds" && variant === "fullscreen") {
              base.left = 0;
              base.top = 0;
              base.width = `${DESIGN_W}px`;
              base.height = `${DESIGN_H}px`;
              base.transform = undefined;
            } else {
              base.left = `${leftPx}px`;
              base.top = `${topPx}px`;
              base.transform =
                tx || ty ? `translate(${tx}%, ${ty}%)` : undefined;
            }

            return (
              <div
                key={getStableKey(ov)}  // ← stable key: no remount on x/y/z changes
                className={`ui-media-overlay__item ui-media-overlay__item--${t}`}
                data-variant={variant}
                data-animation={ov.animation ?? "none"}
                style={base}
              >
                {renderOverlay(ov)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CanopyMediaOverlay;

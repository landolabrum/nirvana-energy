import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import styles from './OverlayScoreBoard.scss';
import Image, { StaticImageData } from 'next/image';
import UiHeader from '@webstack/components/Containers/Header/views/UiHeader/UiHeader';
import environment from '~/src/core/environment';

type Team = {
  id?: number | string;
  name?: string;
  driver?: string;
  throttleman?: string;
  place?: number;
  score?: number;
  color?: string;
  gps?: string;
};

export type TitleInput =
  | string
  | { img?: string | StaticImageData; text?: string; alt?: string; width?: number; height?: number; };

type Props = {
  title?: TitleInput;
  subTitle?: unknown;
  data: { teams: Team[] };
  fullScreen?: boolean;
};

const DEFAULT_TITLE = 'no live';

/* ---------- helpers ---------- */
const rowKey = (t: Team, i: number) => String(t?.id ?? t?.name ?? i);
const rankLabel = (p?: number) =>
  p == null ? '—' : p === 1 ? '1st (Gold)' : p === 2 ? '2nd (Silver)' : p === 3 ? '3rd (Bronze)' : `${p}`;

function normalizeTitle(input?: TitleInput) {
  if (typeof input === 'string' || !input) {
    const text = typeof input === 'string' ? input : DEFAULT_TITLE;
    return { text, img: undefined as string | StaticImageData | undefined, alt: 'Sponsor', width: 170, height: 70 };
  }
  return {
    text: input.text ?? DEFAULT_TITLE,
    img: input.img,
    alt: input.alt ?? (typeof input.text === 'string' ? input.text : 'Sponsor'),
    width: input.width ?? 170,
    height: input.height ?? 70,
  };
}

const getText = (v: unknown): string | undefined => {
  if (typeof v === 'string') return v.trim() || undefined;
  if (v && typeof v === 'object' && 'text' in (v as any) && typeof (v as any).text === 'string') {
    const t = (v as any).text.trim();
    return t || undefined;
  }
  return undefined;
};

/** Stable sort by `place`, then previous visual order */
function stableOrder<T>(
  arr: T[],
  getRank: (t: T) => number | undefined,
  prevOrder: Map<string, number>,
  getKey: (t: T, i: number) => string
) {
  const withIdx = arr.map((t, i) => ({ t, i, k: getKey(t, i) }));
  withIdx.sort((a, b) => {
    const ra = getRank(a.t); const rb = getRank(b.t);
    const aa = ra == null ? Number.POSITIVE_INFINITY : ra;
    const bb = rb == null ? Number.POSITIVE_INFINITY : rb;
    if (aa !== bb) return aa - bb;
    const pa = prevOrder.get(a.k) ?? a.i;
    const pb = prevOrder.get(b.k) ?? b.i;
    return pa - pb;
  });
  return withIdx.map(x => x.t);
}

/* ---------- demo fallback rows when teams are empty ---------- */
const DEMO_TEAMS: Team[] = [
  { id: 11, name: 'Demo Alpha', place: 1, score: 8 },
  { id: 22, name: 'Demo Bravo', place: 2, score: 5 },
  { id: 33, name: 'Demo Charlie', place: 3, score: 3 },
];

/* ---------- intro stage ---------- */
type Stage = 'fade' | 'rows' | 'idle';
const INTRO_FLAG = '__mb_sb_intro_done__'; // set on window to avoid replaying in StrictMode/remounts

const OverlayScoreBoard: React.FC<Props> = ({ title, subTitle, data, fullScreen = false }) => {
  const titleObj = useMemo(() => normalizeTitle(title), [title]);
  const titleText = titleObj.text ?? environment.merchant?.name ?? DEFAULT_TITLE;
  const subTitleText = useMemo(() => getText(subTitle), [subTitle]);

  const incomingTeams = Array.isArray(data?.teams) ? data.teams : [];
  const hasRealTeams = incomingTeams.length > 0;
  const teams = hasRealTeams ? incomingTeams : DEMO_TEAMS;

  /* ===== intro sequence control (one-time per tab) ===== */
  const introDoneRef = useRef<boolean>(
    typeof window !== 'undefined' ? Boolean((window as any)[INTRO_FLAG]) : false
  );
  const [stage, setStage] = useState<Stage>(introDoneRef.current ? 'rows' : 'fade');

  const onBoardAnimationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    // advance ONLY when the board's own fade completes (ignore child animations)
    if (e.currentTarget !== e.target) return;
    if (stage === 'fade') {
      setStage('rows');
      if (typeof window !== 'undefined') (window as any)[INTRO_FLAG] = true;
    }
  }, [stage]);

  /* ===== optional internal scaler ===== */
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!fullScreen) { setScale(1); return; }
    const el = boardRef.current; if (!el) return;
    const recalc = () => {
      const rect = el.getBoundingClientRect();
      const s = Math.min(window.innerWidth / rect.width, window.innerHeight / rect.height);
      setScale(Number.isFinite(s) && s > 0 ? s : 1);
    };
    const r1 = requestAnimationFrame(() => requestAnimationFrame(recalc));
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    window.addEventListener('resize', recalc);
    return () => { ro.disconnect(); window.removeEventListener('resize', recalc); cancelAnimationFrame(r1); };
  }, [fullScreen, titleText, teams.length]);

  /* ===== FLIP re-order ===== */
  const rowNodes = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevRects = useRef<Map<string, DOMRect>>(new Map());
  const prevIndex = useRef<Map<string, number>>(new Map());

  const setRowNode = useCallback((k: string) => (el: HTMLDivElement | null) => {
    if (el) rowNodes.current.set(k, el);
    else rowNodes.current.delete(k);
  }, []);

  const orderedTeams = useMemo(
    () => stableOrder(teams, t => t.place, prevIndex.current, (t, i) => rowKey(t, i)).slice(0, 6),
    [teams]
  );
  const orderSig = useMemo(() => orderedTeams.map((t, i) => rowKey(t, i)).join('|'), [orderedTeams]);

  useLayoutEffect(() => {
    const newRects = new Map<string, DOMRect>();
    const newIndex = new Map<string, number>();
    orderedTeams.forEach((t, i) => {
      const k = rowKey(t, i);
      const n = rowNodes.current.get(k);
      if (n) { newRects.set(k, n.getBoundingClientRect()); newIndex.set(k, i); }
    });

    orderedTeams.forEach((t, i) => {
      const k = rowKey(t, i);
      const node = rowNodes.current.get(k); if (!node) return;
      node.getAnimations().forEach(a => a.cancel());

      const from = prevRects.current.get(k);
      const to   = newRects.get(k);
      if (!from || !to) return;

      const dx = from.left - to.left;
      const dy = from.top  - to.top;
      if (!dx && !dy) return;

      const oldIdx = prevIndex.current.get(k) ?? i;
      const movedUp = oldIdx > i;
      const movedDown = oldIdx < i;
      const scaleTo = movedUp ? 1.06 : movedDown ? 0.985 : 1;

      node.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${scaleTo})`, filter: movedUp ? 'saturate(1.05)' : movedDown ? 'saturate(0.98)' : 'none', boxShadow: movedUp ? '0 10px 24px rgba(0,0,0,.35)' : movedDown ? '0 2px 8px rgba(0,0,0,.25)' : 'none' },
          { transform: 'translate(0, 0) scale(1)', filter: 'none', boxShadow: 'none' }
        ],
        { duration: 380, easing: 'cubic-bezier(.22,.61,.36,1)' }
      );
    });

    prevRects.current = newRects;
    prevIndex.current = newIndex;
  }, [orderSig, orderedTeams]);

  /* ===== score bump ===== */
  const scoreNodes = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevScore  = useRef<Map<string, number>>(new Map());
  const setScoreNode = useCallback((k: string) => (el: HTMLDivElement | null) => {
    if (el) scoreNodes.current.set(k, el);
    else scoreNodes.current.delete(k);
  }, []);
  useEffect(() => {
    orderedTeams.forEach((t, i) => {
      const k = rowKey(t, i);
      const curr = typeof t.score === 'number' ? t.score : undefined;
      const prev = prevScore.current.get(k);
      if (curr != null && prev != null && curr !== prev) {
        const n = scoreNodes.current.get(k);
        if (n) { n.classList.remove('is-score-bump'); (n as any).offsetWidth; n.classList.add('is-score-bump'); }
      }
      if (curr != null) prevScore.current.set(k, curr);
    });
  }, [orderedTeams]);

  /* ===== leader flash ===== */
  const prevLeaderKeyRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!orderedTeams.length) return;
    const idx = Math.max(0, orderedTeams.findIndex(t => t.place === 1));
    const leaderIdx = idx === -1 ? 0 : idx;
    const leaderKey = rowKey(orderedTeams[leaderIdx]!, leaderIdx);
    const prevKey = prevLeaderKeyRef.current;
    if (leaderKey !== prevKey) {
      const node = rowNodes.current.get(leaderKey);
      if (node) {
        node.classList.add('is-leader-flash');
        node.addEventListener('animationend', () => node.classList.remove('is-leader-flash'), { once: true });
      }
      prevLeaderKeyRef.current = leaderKey;
    }
  }, [orderedTeams]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className="scoreboard-wrap" data-fullscreen={fullScreen ? 'true' : 'false'}>
        <div
          ref={boardRef}
          className="scoreboard"
          role="region"
          aria-label={titleText}
          data-stage={stage}               // 'fade' (first mount only) → 'rows'
          onAnimationEnd={onBoardAnimationEnd}
          style={fullScreen ? { transform: `scale(${scale})`, transformOrigin: 'center center' } : undefined}
        >
          {/* Header */}
          <div className="scoreboard__header">
            {titleObj.img && (
              <div className="scoreboard__brand" aria-hidden={titleObj.img ? 'false' : 'true'}>
                <Image
                  src={titleObj.img}
                  alt={titleObj.alt ?? ''}
                  width={titleObj.width}
                  height={titleObj.height}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            <div className="scoreboard__title">
              <UiHeader
                title={titleText}
                subTitle={subTitleText}
                logoSpeed={10}
                logoSize={1}
                logoTravelMargin={3}
                sponsorImgSrc="/merchant/xi1/xLogo.png"
              />
            </div>
          </div>

          {/* Rows */}
          <div className="scoreboard__rows" role="list">
            {orderedTeams.map((team, idx) => {
              const k = rowKey(team, idx);
              const p = team.place;
              const classes = [
                'scoreboard__row',
                p === 1 ? 'is-leader' : '',
                p === 2 ? 'is-podium-2' : '',
                p === 3 ? 'is-podium-3' : '',
              ].filter(Boolean).join(' ');

              return (
                <div
                  key={k}
                  ref={setRowNode(k)}
                  className={classes}
                  aria-label={`${team?.name ?? 'Team'} — place ${rankLabel(p)}`}
                  style={team?.color ? ({ ['--team-color' as any]: team.color } as React.CSSProperties) : undefined}
                >
                  <div className="scoreboard__cell scoreboard__cell--place" aria-hidden="true">{p ?? '—'}</div>
                  <div className="scoreboard__cell scoreboard__cell--name" title={team?.name ?? ''}>{team?.name ?? '—'}</div>
                  <div className="scoreboard__cell scoreboard__cell--id">{team?.id ?? '—'}</div>

                  {/* Hidden score cell kept for bump logic */}
                  <div
                    ref={setScoreNode(k)}
                    style={{ display: 'none' }}
                    className="scoreboard__cell scoreboard__cell--score"
                    aria-label={`score ${team?.score ?? 0}`}
                  >
                    {team?.score ?? 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default OverlayScoreBoard;

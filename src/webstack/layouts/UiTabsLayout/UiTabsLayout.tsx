// Relative Path: ./UiTabsLayout/SettingsView.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styles from './UiTabsLayout.scss';
import UiLoader from '../../components/UiLoader/view/UiLoader';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useRouter } from 'next/router';

interface UiTabsLayoutProps {
  views: Record<string, React.ReactNode>;   // key → node
  labels?: Record<string, string>;          // key → display label (optional)
  setViewCallback?: (viewKey: string) => void;
  variant?: string;
  defaultView?: string;
}

const UiTabsLayout: React.FC<UiTabsLayoutProps> = ({
  views,
  labels,
  setViewCallback,
  variant,
  defaultView,
}) => {
  const router = useRouter();

  // Compute stable keys once per "views" change
  const keys = useMemo(() => Object.keys(views ?? {}), [views]);

  // Helper to choose a valid initial key
  const chooseInitial = useCallback((): string | undefined => {
    const q = (router.query?.vid as string) || '';
    if (q && views && views[q]) return q;
    if (defaultView && views && views[defaultView]) return defaultView;
    return keys[0];
  }, [router.query, defaultView, keys, views]);

  const [view, setView] = useState<string | undefined>(() => undefined);

  // Initialize selection when router + views are ready
  useEffect(() => {
    if (!router.isReady || !keys.length) return;
    const initial = chooseInitial();
    if (initial && initial !== view) {
      setView(initial);
    }
  }, [router.isReady, keys.length, chooseInitial]);

  // If current view becomes invalid because "views" changed, reselect safely
  useEffect(() => {
    if (!keys.length) return;
    if (!view || !views[view]) {
      const safe = chooseInitial();
      if (safe && safe !== view) setView(safe);
    }
  }, [views, keys, view, chooseInitial]);

  // Keep URL in sync with current view (shallow, no scroll)
  useEffect(() => {
    if (!router.isReady || !view) return;
    const current = router.query?.vid as string | undefined;
    if (current !== view) {
      router.replace(
        { pathname: router.pathname, query: { ...router.query, vid: view } },
        undefined,
        { shallow: true, scroll: false }
      );
    }
  }, [view, router]);

  const handleView = useCallback(
    (v: string) => {
      if (v === view) return; // no-op if already selected
      setView(v);
      setViewCallback?.(v);
      // URL sync handled by the effect above
    },
    [view, setViewCallback]
  );

  // Memoize the selected content to avoid unnecessary re-renders
  const content = useMemo(() => (view ? views[view] ?? null : null), [view, views]);
  const title = useMemo(() => (view ? labels?.[view] ?? view : ''), [view, labels]);

  // Show loader only while we’re resolving the initial view
  if (!keys.length || !view) return <UiLoader />;

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`tabs${variant ? ` tabs__${variant}` : ''}`}>
        <div className={`tabs__content${variant ? ` tabs__content__${variant}` : ''}`}>
          <div className={`tabs__tabs${variant ? ` tabs__tabs__${variant}` : ''}`}>
            {keys.map((k) => {
              const active = view === k;
              return (
                <button
                  key={k}
                  type="button"
                  className={`tabs-layout__tab${active ? ' tabs-layout__tab__active' : ''}${
                    variant ? ` tabs-layout__tab__${variant}` : ''
                  }`}
                  onClick={() => handleView(k)}
                  aria-selected={active}
                  aria-controls={`tabs-view-${k}`}
                  role="tab"
                >
                  <div className="tabs-layout__tab--icon">
                    <UiIcon icon="c-race-lines" />
                  </div>
                  {labels?.[k] ?? k}
                  <div className="tabs-layout__tab--icon">
                    <UiIcon icon="c-race-lines" />
                  </div>
                </button>
              );
            })}
          </div>

          <div
            id={`tabs-view-${view}`}
            className={`tabs__view${variant ? ` tabs-view__${variant}` : ''}`}
            role="tabpanel"
            aria-labelledby={view}
          >
            {title && <div className="tabs__view__title">{title}</div>}
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default UiTabsLayout;

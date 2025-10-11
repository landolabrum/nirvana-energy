import React from 'react';
import styles from './OverlayL3.scss';
import UiMarkdown from '@webstack/components/UiMarkDown/UiMarkDown';

export type TitleLike =
  | string
  | { text?: string; img?: any; alt?: string; width?: number; height?: number };

export interface OverlayL3Props {
  title?: TitleLike;
  description?: TitleLike;
  items?: any[];
  data?: any;
  variant?: 'default' | 'fullscreen' | 'image-left' | 'image-right';
  link_url?: string;
}

const textOf = (v?: TitleLike) =>
  typeof v === 'string' ? v : (v?.text ?? '');

const OverlayL3: React.FC<OverlayL3Props> = ({
  title,
  description,
  items,
  data,
  variant = 'default',
  link_url,
}) => {
  const cls = `l3 ${variant === 'fullscreen' ? 'l3--fullscreen' : ''} ${variant}`.trim();

  const hasContent =
    !!(
      (title && textOf(title)) ||
      (description && textOf(description)) ||
      link_url ||
      (Array.isArray(items) && items.length > 0)
    );

  return (
    <>
      <style jsx>{styles}</style>
      <div className={cls} data-variant={variant}>
        {!hasContent && (
          <div className="l3__empty">lower thirds</div>
        )}

        {hasContent && (
          <>
            {/* Title */}
            {title && textOf(title) && (
              <div className="l3__title">
                <UiMarkdown text={textOf(title)} />
              </div>
            )}

            {/* Description */}
            {description && textOf(description) && (
              <div className="l3__desc">
                <UiMarkdown text={textOf(description)} />
              </div>
            )}

            {/* Optional image */}
            {link_url && (
              <div className="l3__image">
                <img
                  src={link_url}
                  alt={typeof title === 'object' && title.alt ? title.alt : 'Link Image'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}

            {/* Items */}
            {Array.isArray(items) && items.length > 0 && (
              <div className="l3__items">
                {items.map((it, i) => (
                  <div className="l3__item" key={i}>
                    <UiMarkdown text={textOf(it)} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OverlayL3;

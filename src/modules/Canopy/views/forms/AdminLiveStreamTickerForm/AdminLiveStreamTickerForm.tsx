import React from 'react';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import type { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { OVERLAY_ANIMATION_OPTIONS, OVERLAY_VARIANT_OPTIONS, OverlayType } from '@Canopy/views/CanopyOverlays/canopyOverlayTypes';


export type TickerOverlay = {
  id: string;
  type: OverlayType;         // "ticker"
  enabled: boolean;
  x: number;
  y: number;
  z_index: number;
  variant: string;
  animation: string;
  delay_ms: number;
  title: string;
  description: string;
  icon: string;
  link: string;
  data?: { items?: string[] } | any;
};

type Props = {
  eventName?: string;
  overlay: TickerOverlay;
  size?: 'sm' | 'md' | 'lg';
  onChange: (e: any) => void;
  onAddField?: (e: any) => void;
};

const fieldsForTicker = (eventName: string | undefined, ov: TickerOverlay): IFormField[] => {
  const items: string[] = Array.isArray(ov?.data?.items) ? ov.data.items : [];
  const base: IFormField[] = [
    // { name: 'event', label: 'Event', type: 'text', readonly: true, value: eventName ?? '-' },
    { name: 'type', label: 'Type', type: 'text', readonly: true, value: 'ticker' },
    // { name: 'enabled', label: 'Enabled', type: 'checkbox', value: ov.enabled },
    { name: 'x', label: 'X (%)', type: 'number', value: ov.x, min: 0, max: 100 },
    { name: 'y', label: 'Y (%)', type: 'number', value: ov.y, min: 0, max: 100 },
    { name: 'z_index', label: 'Z-Index', type: 'number', value: ov.z_index },
    { name: 'variant', label: 'Variant', type: 'select', value: ov.variant, options: OVERLAY_VARIANT_OPTIONS },
    { name: 'animation', label: 'Animation', type: 'select', value: ov.animation, options: OVERLAY_ANIMATION_OPTIONS },
    { name: 'delay_ms', label: 'Delay (ms)', type: 'number', value: ov.delay_ms, min: 0 },
    { name: 'title', label: 'Title', type: 'text', value: ov.title },
    { name: 'description', label: 'Description', type: 'text', value: ov.description },
    { name: 'icon', label: 'Icon URL', type: 'text', value: ov.icon },
    { name: 'link', label: 'Link URL', type: 'text', value: ov.link },
    {
      name: 'data.items',
      label: 'Ticker items',
      type: 'multi-select',
      value: items,
      options: items.map((txt) => ({ label: txt, value: txt })),
      input: true,
      width: '100%',
    } as unknown as IFormField,
  ];
  return base.map((f: any) => ({ ...f, width: f.width ?? '20%' }));
};

const AdminLiveStreamTickerForm: React.FC<Props> = ({ eventName, overlay, size, onChange, onAddField }) => (
  <UiForm
    title="Ticker"
    size={size}
    fields={fieldsForTicker(eventName, overlay)}
    onChange={onChange}
    onAddField={onAddField}
  />
);

export default AdminLiveStreamTickerForm;

'use client';

import React from 'react';
import type { WidgetRegistry } from '../runtime/widget-registry';
import type { BundleNodeKind } from '../spec/types';

export interface WidgetPaletteProps {
  registry: WidgetRegistry;
  allowedNodeKinds?: BundleNodeKind[];
  onInsert?: (widgetKey: string, slotId: string) => void;
}

/**
 * Lists available widgets from the registry for customization mode.
 * Filtered by allowedNodeKinds when provided. Each item can be dragged to a slot.
 */
export function WidgetPalette({
  registry,
  allowedNodeKinds,
  onInsert,
}: WidgetPaletteProps) {
  const widgets = registry.listByTrust('core');
  const filtered =
    !allowedNodeKinds || allowedNodeKinds.includes('custom-widget')
      ? widgets
      : [];

  return (
    <div
      data-widget-palette
      style={{
        padding: '12px',
        minWidth: '180px',
        borderRight: '1px solid var(--border, #e5e7eb)',
        backgroundColor: 'var(--muted, #f9fafb)',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '8px',
          textTransform: 'uppercase',
          color: 'var(--muted-foreground, #6b7280)',
        }}
      >
        Widgets
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filtered.map((w) => (
          <li
            key={w.widgetKey}
            data-widget-key={w.widgetKey}
            style={{
              padding: '8px 12px',
              marginBottom: '4px',
              borderRadius: '6px',
              cursor: onInsert ? 'grab' : 'default',
              backgroundColor: 'white',
              border: '1px solid var(--border, #e5e7eb)',
            }}
            onClick={
              onInsert
                ? () => onInsert(w.widgetKey, 'primary')
                : undefined
            }
          >
            {w.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

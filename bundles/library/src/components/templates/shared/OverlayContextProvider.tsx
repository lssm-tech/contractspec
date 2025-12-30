'use client';

import * as React from 'react';
import { useContext, useMemo } from 'react';
import type { TemplateId } from '../../../lib/registry';

/**
 * Overlay modification operation types (for OverlayContextProvider)
 */
export type OverlayModificationOp =
  | { op: 'hide' }
  | { op: 'relabel'; label: string }
  | { op: 'reorder'; position: number }
  | { op: 'restyle'; className?: string; variant?: string }
  | { op: 'set-default'; value: unknown };

/**
 * Overlay spec for a field or component
 */
export interface OverlaySpec {
  id: string;
  target: string; // path to the field/component
  modifications: OverlayModificationOp[];
  conditions?: {
    role?: string[];
    device?: 'mobile' | 'desktop' | 'any';
    featureFlags?: string[];
  };
}

/**
 * Context value for overlay engine
 */
export interface OverlayContextValue {
  /** Current overlays */
  overlays: OverlaySpec[];
  /** Apply overlays to a component */
  applyOverlay: <T extends Record<string, unknown>>(
    path: string,
    target: T
  ) => T;
  /** Check if a field should be hidden */
  isHidden: (path: string) => boolean;
  /** Get relabeled text */
  getLabel: (path: string, defaultLabel: string) => string;
  /** Get position for reordering */
  getPosition: (path: string, defaultPosition: number) => number;
  /** Get style modifications */
  getStyle: (path: string) => { className?: string; variant?: string };
  /** Get default value */
  getDefault: <T>(path: string, defaultValue: T) => T;
  /** Current user role */
  role: string;
  /** Current device type */
  device: 'mobile' | 'desktop';
}

const OverlayContext = React.createContext<OverlayContextValue | null>(null);

export interface OverlayContextProviderProps extends React.PropsWithChildren {
  templateId: TemplateId;
  role?: string;
  device?: 'mobile' | 'desktop';
}

/**
 * Provider for overlay engine context.
 * Loads template-specific overlays and provides helper functions.
 */
export function OverlayContextProvider({
  templateId,
  role = 'user',
  device = 'desktop',
  children,
}: OverlayContextProviderProps) {
  // Load template-specific overlays
  const overlays = useMemo(
    () => getTemplateOverlays(templateId, role),
    [templateId, role]
  );

  // Filter overlays based on current context
  const activeOverlays = useMemo(() => {
    return overlays.filter((overlay) => {
      const conditions = overlay.conditions;
      if (!conditions) return true;

      if (conditions.role && !conditions.role.includes(role)) {
        return false;
      }

      if (
        conditions.device &&
        conditions.device !== 'any' &&
        conditions.device !== device
      ) {
        return false;
      }

      return true;
    });
  }, [overlays, role, device]);

  // Create overlay map for quick lookups
  const overlayMap = useMemo(() => {
    const map = new Map<string, OverlaySpec>();
    for (const overlay of activeOverlays) {
      map.set(overlay.target, overlay);
    }
    return map;
  }, [activeOverlays]);

  // Apply overlay to a target object
  const applyOverlay = useMemo(
    () =>
      <T extends Record<string, unknown>>(path: string, target: T): T => {
        const overlay = overlayMap.get(path);
        if (!overlay) return target;

        let result = { ...target };
        for (const mod of overlay.modifications) {
          switch (mod.op) {
            case 'hide':
              result = { ...result, hidden: true };
              break;
            case 'relabel':
              result = { ...result, label: mod.label };
              break;
            case 'reorder':
              result = { ...result, position: mod.position };
              break;
            case 'restyle':
              result = {
                ...result,
                className: mod.className,
                variant: mod.variant,
              };
              break;
            case 'set-default':
              result = { ...result, defaultValue: mod.value };
              break;
          }
        }
        return result;
      },
    [overlayMap]
  );

  // Check if field is hidden
  const isHidden = useMemo(
    () =>
      (path: string): boolean => {
        const overlay = overlayMap.get(path);
        return overlay?.modifications.some((m) => m.op === 'hide') ?? false;
      },
    [overlayMap]
  );

  // Get relabeled text
  const getLabel = useMemo(
    () =>
      (path: string, defaultLabel: string): string => {
        const overlay = overlayMap.get(path);
        const relabel = overlay?.modifications.find((m) => m.op === 'relabel');
        return relabel && relabel.op === 'relabel'
          ? relabel.label
          : defaultLabel;
      },
    [overlayMap]
  );

  // Get position for reordering
  const getPosition = useMemo(
    () =>
      (path: string, defaultPosition: number): number => {
        const overlay = overlayMap.get(path);
        const reorder = overlay?.modifications.find((m) => m.op === 'reorder');
        return reorder && reorder.op === 'reorder'
          ? reorder.position
          : defaultPosition;
      },
    [overlayMap]
  );

  // Get style modifications
  const getStyle = useMemo(
    () =>
      (path: string): { className?: string; variant?: string } => {
        const overlay = overlayMap.get(path);
        const restyle = overlay?.modifications.find((m) => m.op === 'restyle');
        if (restyle && restyle.op === 'restyle') {
          return {
            className: restyle.className,
            variant: restyle.variant,
          };
        }
        return {};
      },
    [overlayMap]
  );

  // Get default value
  const getDefault = useMemo(
    () =>
      <T,>(path: string, defaultValue: T): T => {
        const overlay = overlayMap.get(path);
        const setDefault = overlay?.modifications.find(
          (m) => m.op === 'set-default'
        );
        return setDefault && setDefault.op === 'set-default'
          ? (setDefault.value as T)
          : defaultValue;
      },
    [overlayMap]
  );

  const value = useMemo<OverlayContextValue>(
    () => ({
      overlays: activeOverlays,
      applyOverlay,
      isHidden,
      getLabel,
      getPosition,
      getStyle,
      getDefault,
      role,
      device,
    }),
    [
      activeOverlays,
      applyOverlay,
      isHidden,
      getLabel,
      getPosition,
      getStyle,
      getDefault,
      role,
      device,
    ]
  );

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
}

/**
 * Hook to access overlay context
 */
export function useOverlayContext(): OverlayContextValue {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error(
      'useOverlayContext must be used within an OverlayContextProvider'
    );
  }
  return context;
}

/**
 * Hook to check if within overlay context
 */
export function useIsInOverlayContext(): boolean {
  return useContext(OverlayContext) !== null;
}

/**
 * Get template-specific overlays
 */
function getTemplateOverlays(
  templateId: TemplateId,
  _role: string
): OverlaySpec[] {
  // Demo overlays for each template
  const templateOverlays: Record<string, OverlaySpec[]> = {
    'crm-pipeline': [
      {
        id: 'crm-hide-internal-fields',
        target: 'deal.internalNotes',
        modifications: [{ op: 'hide' }],
        conditions: { role: ['viewer', 'user'] },
      },
      {
        id: 'crm-relabel-value',
        target: 'deal.value',
        modifications: [{ op: 'relabel', label: 'Deal Amount' }],
      },
    ],
    'saas-boilerplate': [
      {
        id: 'saas-hide-billing',
        target: 'settings.billing',
        modifications: [{ op: 'hide' }],
        conditions: { role: ['viewer'] },
      },
      {
        id: 'saas-restyle-plan',
        target: 'settings.plan',
        modifications: [{ op: 'restyle', variant: 'premium' }],
        conditions: { role: ['admin'] },
      },
    ],
    'agent-console': [
      {
        id: 'agent-hide-cost',
        target: 'run.cost',
        modifications: [{ op: 'hide' }],
        conditions: { role: ['viewer'] },
      },
      {
        id: 'agent-relabel-tokens',
        target: 'run.tokens',
        modifications: [{ op: 'relabel', label: 'Token Usage' }],
      },
    ],
    'todos-app': [
      {
        id: 'todos-hide-assignee',
        target: 'task.assignee',
        modifications: [{ op: 'hide' }],
        conditions: { device: 'mobile' },
      },
    ],
    'messaging-app': [
      {
        id: 'messaging-reorder-timestamp',
        target: 'message.timestamp',
        modifications: [{ op: 'reorder', position: 0 }],
      },
    ],
    'recipe-app-i18n': [
      {
        id: 'recipe-relabel-servings',
        target: 'recipe.servings',
        modifications: [{ op: 'relabel', label: 'Portions' }],
      },
    ],
  };

  return templateOverlays[templateId] ?? [];
}

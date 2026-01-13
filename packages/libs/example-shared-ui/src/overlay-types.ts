/**
 * Shared Overlay Type Definitions
 *
 * These types are used across all template overlays to ensure consistency.
 */

export interface OverlayDefinition {
  overlayId: string;
  version: string;
  description: string;
  appliesTo: {
    presentation?: string;
    role?: string;
    feature?: string;
    tier?: string;
  };
  modifications: OverlayModification[];
}

export type OverlayModification =
  | { type: 'hideField'; field: string; reason?: string }
  | { type: 'renameLabel'; field: string; newLabel: string }
  | { type: 'addBadge'; position: string; label: string; variant?: string }
  | { type: 'setDefault'; field: string; value: unknown }
  | { type: 'setLimit'; field: string; max: number; message?: string };

/**
 * Typed message keys for surface-runtime i18n.
 * User-facing strings in OverlayConflictResolver, PatchProposalCard, etc.
 */

export const SURFACE_KEYS = {
  'overlay.conflicts.title': 'overlay.conflicts.title',
  'overlay.conflicts.keepScope': 'overlay.conflicts.keepScope',
  'patch.accept': 'patch.accept',
  'patch.reject': 'patch.reject',
  'patch.addWidget': 'patch.addWidget',
  'patch.removeItem': 'patch.removeItem',
  'patch.switchLayout': 'patch.switchLayout',
  'patch.showField': 'patch.showField',
  'patch.hideField': 'patch.hideField',
  'patch.moveTo': 'patch.moveTo',
  'patch.replaceItem': 'patch.replaceItem',
  'patch.promote': 'patch.promote',
  'patch.changes': 'patch.changes',
} as const;

export type SurfaceMessageKey = (typeof SURFACE_KEYS)[keyof typeof SURFACE_KEYS];

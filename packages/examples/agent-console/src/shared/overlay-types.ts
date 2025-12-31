export interface OverlayDefinition {
  overlayId: string;
  version: string;
  description: string;
  appliesTo: Record<string, string>;
  modifications: OverlayModification[];
}

export type OverlayModification =
  | HideFieldModification
  | RenameLabelModification
  | AddBadgeModification
  | SetLimitModification;

export interface HideFieldModification {
  type: 'hideField';
  field: string;
  reason?: string;
}

export interface RenameLabelModification {
  type: 'renameLabel';
  field: string;
  newLabel: string;
}

export interface AddBadgeModification {
  type: 'addBadge';
  position: 'header' | 'footer';
  label: string;
  variant: 'warning' | 'info' | 'error' | 'success' | 'default';
}

export interface SetLimitModification {
  type: 'setLimit';
  field: string;
  max: number;
  message: string;
}

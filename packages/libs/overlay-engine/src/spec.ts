import type { AnyOperationSpec } from '@contractspec/lib.contracts-spec';

export type OverlayScopeKey =
  | 'tenantId'
  | 'role'
  | 'userId'
  | 'device'
  | 'tags';

export interface OverlayScopeContext {
  tenantId?: string;
  role?: string;
  userId?: string;
  device?: string;
  tags?: string[];
}

export interface OverlayTargetRef {
  capability?: string;
  workflow?: string;
  dataView?: string;
  presentation?: string;
  operation?: AnyOperationSpec['meta']['key'];
}

export interface OverlayAppliesTo
  extends OverlayScopeContext, OverlayTargetRef {
  /**
   * Optional label to describe why this overlay exists (displayed in tooling).
   */
  label?: string;
}

export type OverlayModification =
  | HideFieldModification
  | RenameLabelModification
  | ReorderFieldsModification
  | SetDefaultModification
  | AddHelpTextModification
  | MakeRequiredModification;

export interface OverlayFieldModificationBase {
  field: string;
  description?: string;
}

export interface HideFieldModification extends OverlayFieldModificationBase {
  type: 'hideField';
  reason?: string;
}

export interface RenameLabelModification extends OverlayFieldModificationBase {
  type: 'renameLabel';
  newLabel: string;
}

export interface ReorderFieldsModification {
  type: 'reorderFields';
  fields: string[];
  description?: string;
}

export interface SetDefaultModification extends OverlayFieldModificationBase {
  type: 'setDefault';
  value: unknown;
}

export interface AddHelpTextModification extends OverlayFieldModificationBase {
  type: 'addHelpText';
  text: string;
}

export interface MakeRequiredModification extends OverlayFieldModificationBase {
  type: 'makeRequired';
  required?: boolean;
}

export interface OverlaySpec {
  overlayId: string;
  version: string;
  description?: string;
  appliesTo: OverlayAppliesTo;
  modifications: OverlayModification[];
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt?: string;
}

export type OverlaySignatureAlgorithm = 'ed25519' | 'rsa-pss-sha256';

export interface OverlaySignatureBlock {
  algorithm: OverlaySignatureAlgorithm;
  signature: string;
  publicKey: string;
  keyId?: string;
  issuedAt?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export type SignedOverlaySpec = OverlaySpec & {
  signature: OverlaySignatureBlock;
};

export type OverlayInput = OverlaySpec | SignedOverlaySpec;

export const OVERLAY_SCOPE_ORDER: OverlayScopeKey[] = [
  'tenantId',
  'role',
  'userId',
  'device',
  'tags',
];

export function defineOverlay<T extends OverlaySpec>(spec: T): T {
  return spec;
}











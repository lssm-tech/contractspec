import type { AnySchemaModel } from '@lssm/lib.schema';
import type { OwnerShipMeta } from '../ownership';
import type { BlockConfig } from '@blocknote/core';
import type { DocId } from '../docs/registry';

/** Supported render targets for the transform engine and descriptors. */
export type PresentationTarget =
  | 'react'
  | 'markdown'
  | 'application/json'
  | 'application/xml';

// export interface PresentationMeta extends Partial<OwnerShipMeta> {
export interface PresentationMeta extends OwnerShipMeta {
  /** Fully-qualified presentation name (e.g., "sigil.auth.webauth_tabs_v2"). */
  name: string;
  /** Version of this descriptor. Increment on breaking changes. */
  version: number;
  /** Human-readable description for docs/a11y. Required by validators. */
  description: string;
  /** Optional doc block id for this presentation. */
  docId?: DocId;
}

/** React component presentation source. */
export interface PresentationSourceComponentReact {
  /** Source marker for React component presentations. */
  type: 'component';
  /** Framework for the component source (currently only 'react'). */
  framework: 'react';
  /** Component key resolved by host `componentMap`. */
  componentKey: string;
  /** Optional props schema to validate against. */
  props?: AnySchemaModel;
}

/** BlockNoteJS document presentation source. */
export interface PresentationSourceBlocknotejs {
  /** Source marker for BlockNoteJS document presentations. */
  type: 'blocknotejs';
  /** BlockNoteJS JSON document. */
  docJson: unknown;
  /** Optional BlockNote config to guide rendering. */
  blockConfig?: BlockConfig;
}

export type PresentationSource =
  | PresentationSourceComponentReact
  | PresentationSourceBlocknotejs;

/**
 * Normalized presentation spec decoupled from framework/adapters.
 * Renderers and validators are provided via TransformEngine.
 */
export interface PresentationSpec {
  meta: PresentationMeta;
  policy?: { flags?: string[]; pii?: string[] };
  source: PresentationSource;
  targets: PresentationTarget[]; // which outputs are supported by transforms
}

export const definePresentation = (spec: PresentationSpec) => {
  return spec;
};

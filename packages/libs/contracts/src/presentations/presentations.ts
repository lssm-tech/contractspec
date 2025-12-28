import type { AnySchemaModel } from '@contractspec/lib.schema';
import type { OwnerShipMeta } from '../ownership';
import type { BlockConfig } from '@blocknote/core';

/** Supported render targets for the transform engine and descriptors. */
export type PresentationTarget =
  | 'react'
  | 'markdown'
  | 'application/json'
  | 'application/xml';

export interface PresentationSpecMeta extends OwnerShipMeta {
  /** Business goal: why this exists */
  goal: string;
  /** Background, constraints, scope edges (feeds docs & LLM context) */
  context: string;
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
  meta: PresentationSpecMeta;
  policy?: { flags?: string[]; pii?: string[] };
  source: PresentationSource;
  targets: PresentationTarget[]; // which outputs are supported by transforms
}

export const definePresentation = (spec: PresentationSpec) => {
  return spec;
};

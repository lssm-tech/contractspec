import type { AnySchemaModel } from '@lssm/lib.schema';
import type { OwnerShipMeta } from '../ownership';
import type { BlockConfig } from '@blocknote/core';
import type { DocId } from '../docs/registry';
import { filterBy, getUniqueTags, groupBy } from '../registry-utils';

/** Supported render targets for the transform engine and descriptors. */
export type PresentationTarget =
  | 'react'
  | 'markdown'
  | 'application/json'
  | 'application/xml';

export interface PresentationMeta extends Partial<OwnerShipMeta> {
  /** Fully-qualified presentation name (e.g., "sigil.auth.webauth_tabs_v2"). */
  name: string;
  /** Version of this descriptor. Increment on breaking changes. */
  version: number;
  /** Human-readable description for docs/a11y. Required by validators. */
  description?: string;
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

/** @deprecated Use PresentationSpec instead */
export type PresentationDescriptorV2 = PresentationSpec;

/** @deprecated Use PresentationMeta instead */
export type PresentationV2Meta = PresentationMeta;

function keyOf(p: PresentationSpec) {
  return `${p.meta.name}.v${p.meta.version}`;
}

/** In-memory registry for PresentationSpec. */
export class PresentationRegistry {
  private items = new Map<string, PresentationSpec>();

  constructor(items?: PresentationSpec[]) {
    if (items) {
      items.forEach((p) => this.register(p));
    }
  }

  register(p: PresentationSpec): this {
    const key = keyOf(p);
    if (this.items.has(key)) throw new Error(`Duplicate presentation ${key}`);
    this.items.set(key, p);
    return this;
  }

  list(): PresentationSpec[] {
    return [...this.items.values()];
  }

  get(name: string, version?: number): PresentationSpec | undefined {
    if (version != null) return this.items.get(`${name}.v${version}`);
    let candidate: PresentationSpec | undefined;
    let max = -Infinity;
    for (const [k, p] of this.items.entries()) {
      if (!k.startsWith(`${name}.v`)) continue;
      if (p.meta.version > max) {
        max = p.meta.version;
        candidate = p;
      }
    }
    return candidate;
  }

  /** Filter presentations by criteria. */
  filter(
    criteria: import('../registry-utils').RegistryFilter
  ): PresentationSpec[] {
    return filterBy(this.list(), criteria);
  }

  /** List presentations with specific tag. */
  listByTag(tag: string): PresentationSpec[] {
    return this.list().filter((p) => p.meta.tags?.includes(tag));
  }

  /** List presentations by owner. */
  listByOwner(owner: string): PresentationSpec[] {
    return this.list().filter((p) => p.meta.owners?.includes(owner));
  }

  /** Group presentations by key function. */
  groupBy(
    keyFn: import('../registry-utils').GroupKeyFn<PresentationSpec>
  ): Map<string, PresentationSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all presentations. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}

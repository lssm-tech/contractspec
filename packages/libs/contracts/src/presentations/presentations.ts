import { filterBy, getUniqueTags, groupBy } from '../registry-utils';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { Stability } from '../ownership';
import z from 'zod';

/** V1 presentation kinds (back-compat). Prefer V2 descriptors for new work. */
export type PresentationKind = 'web_component' | 'markdown' | 'data';

/** Minimal metadata for presentations (V1). */
export interface PresentationMeta {
  name: string;
  version: number;
  stability?: Stability;
  owners?: string[];
  tags?: string[];
  description?: string;
}

/** Policy for presentations (flags, pii). */
export interface PresentationPolicy {
  flags?: string[];
  pii?: string[];
}

/** Web component presentation (V1). */
export interface WebComponentPresentation {
  kind: 'web_component';
  framework: 'react'; // future: 'vue' | 'angular'
  /** Symbolic key resolved by host via component map */
  componentKey: string;
  /** Props schema (validated at runtime) */
  props: AnySchemaModel;
  analytics?: string[];
}

/** Markdown presentation (V1). */
export interface MarkdownPresentation {
  kind: 'markdown';
  /** Inline markdown/MDX content */
  content?: string;
  /** Or a resolvable resource URI handled by ResourceRegistry */
  resourceUri?: string;
}

/** Data presentation (V1): structured export description. */
export interface DataPresentation {
  kind: 'data';
  mimeType: string; // e.g., application/json, application/xml
  /** Structured data schema */
  model: AnySchemaModel;
}

export type PresentationContent =
  | WebComponentPresentation
  | MarkdownPresentation
  | DataPresentation;

export interface PresentationSpec {
  meta: PresentationMeta;
  policy?: PresentationPolicy;
  content: PresentationContent;
}

function keyOf(p: PresentationSpec) {
  return `${p.meta.name}.v${p.meta.version}`;
}

/** In-memory registry for V1 PresentationSpec. */
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

export function jsonSchemaForPresentation(p: PresentationSpec) {
  const base = {
    meta: {
      name: p.meta.name,
      version: p.meta.version,
      stability: p.meta.stability ?? 'stable',
      tags: p.meta.tags ?? [],
      description: p.meta.description ?? '',
    },
    kind: p.content.kind as PresentationKind,
  } as const;

  if (p.content.kind === 'web_component') {
    return {
      ...base,
      framework: p.content.framework,
      componentKey: p.content.componentKey,
      props: z.toJSONSchema(p.content.props.getZod()),
    };
  }
  if (p.content.kind === 'markdown') {
    return {
      ...base,
      content: p.content.content,
      resourceUri: p.content.resourceUri,
    };
  }
  return {
    ...base,
    mimeType: p.content.mimeType,
    model: z.toJSONSchema(p.content.model.getZod()),
  };
}

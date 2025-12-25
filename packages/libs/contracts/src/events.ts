import { type AnySchemaModel } from '@lssm/lib.schema';
import type { OwnerShipMeta } from './ownership';
import type { DocId } from './docs/registry';
import { filterBy, getUniqueTags, groupBy } from './registry-utils';

export interface EventSpecMeta extends Omit<OwnerShipMeta, 'docId'> {
  /** Doc block(s) for this operation. */
  docId?: DocId[];
}

/**
 * Typed event specification. Declare once, validate payloads at publish time,
 * and guard emissions via the contracts runtime.
 */
export interface EventSpec<T extends AnySchemaModel> {
  meta: EventSpecMeta;
  /** JSON-like paths to redact from logs/exports. */
  pii?: string[];
  /** Event payload schema from @lssm/lib.schema. */
  payload: T;
}

export type AnyEventSpec<T extends AnySchemaModel = AnySchemaModel> =
  EventSpec<T>;

/** Identity function to keep type inference when declaring events. */
export function defineEvent<T extends AnySchemaModel>(
  e: EventSpec<T>
): EventSpec<T> {
  return e;
}

export interface EventEnvelope<T> {
  /** Unique identifier for the published event (UUID recommended). */
  id: string;
  /** ISO timestamp when the event occurred. */
  occurredAt: string;
  /** Optional trace identifier for correlating across services. */
  traceId?: string;
  /** Event name as published (should match spec.name). */
  key: string;
  /** Event version as published (should match spec.version). */
  version: number;
  /** Validated payload. */
  payload: T;
}

export type EventKey = `${string}.v${number}`;
/** Build a stable string key for an event name/version pair. */
export const eventKey = (key: string, version: number): EventKey =>
  `${key}.v${version}`;

function keyOf(p: AnyEventSpec) {
  return `${p.meta.key}.v${p.meta.version}`;
}

/** In-memory registry for EventSpec. */
export class EventRegistry {
  private items = new Map<string, AnyEventSpec>();

  constructor(items?: AnyEventSpec[]) {
    if (items) {
      items.forEach((p) => this.register(p));
    }
  }

  register(p: AnyEventSpec): this {
    const key = keyOf(p);
    if (this.items.has(key)) throw new Error(`Duplicate presentation ${key}`);
    this.items.set(key, p);
    return this;
  }

  list(): AnyEventSpec[] {
    return [...this.items.values()];
  }

  get(key: string, version?: number): AnyEventSpec | undefined {
    if (version != null) return this.items.get(`${key}.v${version}`);
    let candidate: AnyEventSpec | undefined;
    let max = -Infinity;
    for (const [k, p] of this.items.entries()) {
      if (!k.startsWith(`${key}.v`)) continue;
      if (p.meta.version > max) {
        max = p.meta.version;
        candidate = p;
      }
    }
    return candidate;
  }

  /** Filter presentations by criteria. */
  filter(criteria: import('./registry-utils').RegistryFilter): AnyEventSpec[] {
    return filterBy(this.list(), criteria);
  }

  /** List presentations with specific tag. */
  listByTag(tag: string): AnyEventSpec[] {
    return this.list().filter((p) => p.meta.tags?.includes(tag));
  }

  /** List presentations by owner. */
  listByOwner(owner: string): AnyEventSpec[] {
    return this.list().filter((p) => p.meta.owners?.includes(owner));
  }

  /** Group presentations by key function. */
  groupBy(
    keyFn: import('./registry-utils').GroupKeyFn<AnyEventSpec>
  ): Map<string, AnyEventSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all presentations. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}

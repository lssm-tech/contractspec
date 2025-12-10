import { type AnySchemaModel } from '@lssm/lib.schema';
import type { OwnerShipMeta } from './ownership';
import type { DocId } from './docs/registry';

/**
 * Typed event specification. Declare once, validate payloads at publish time,
 * and guard emissions via the contracts runtime.
 */
export interface EventSpec<T extends AnySchemaModel> {
  /** Fully-qualified event name, e.g. "sigil.magic_link.created". */
  name: string;
  /** Event payload version. Bump on any breaking payload change. */
  version: number;
  /** Short human-friendly summary. */
  description?: string;
  /** JSON-like paths to redact from logs/exports. */
  pii?: string[];
  /** Event payload schema from @lssm/lib.schema. */
  payload: T;
  /** Optional ownership metadata for governance and docs. */
  ownership?: OwnerShipMeta;
  /** Optional doc block id for this event. */
  docId?: DocId;
}

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
  name: string;
  /** Event version as published (should match spec.version). */
  version: number;
  /** Validated payload. */
  payload: T;
}

export type EventKey = `${string}.v${number}`;
/** Build a stable string key for an event name/version pair. */
export const eventKey = (name: string, version: number): EventKey =>
  `${name}.v${version}`;

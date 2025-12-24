import { type AnySchemaModel } from '@lssm/lib.schema';
import type { OwnerShipMeta, Stability } from './ownership';
import type { DocId } from './docs/registry';


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

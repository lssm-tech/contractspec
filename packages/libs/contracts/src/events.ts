import { type AnySchemaModel } from '@contractspec/lib.schema';
import type { OwnerShipMeta } from './ownership';
import type { DocId } from './docs/registry';
import { SpecContractRegistry } from './registry';

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
  /** Event payload schema from @contractspec/lib.schema. */
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

/** In-memory registry for EventSpec. */
export class EventRegistry extends SpecContractRegistry<'event', AnyEventSpec> {
  public constructor(items?: AnyEventSpec[]) {
    super('event', items);
  }
}

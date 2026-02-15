/**
 * Event specification types for ContractSpec.
 *
 * Events represent domain occurrences that can be emitted by operations
 * and consumed by other systems. Event specs define the structure,
 * ownership, and PII handling for event payloads.
 *
 * @module events
 *
 * @example
 * ```typescript
 * import { defineEvent } from '@contractspec/lib.contracts-spec';
 * import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
 *
 * const UserCreatedEvent = defineEvent({
 *   meta: {
 *     key: 'user.created',
 *     version: '1.0.0',
 *     description: 'Emitted when a new user is created',
 *     stability: 'stable',
 *     owners: ['platform.core'],
 *     tags: ['auth', 'users'],
 *   },
 *   pii: ['email'],
 *   payload: new SchemaModel({
 *     name: 'UserCreatedPayload',
 *     fields: {
 *       userId: { type: ScalarTypeEnum.UUID(), isOptional: false },
 *       email: { type: ScalarTypeEnum.Email(), isOptional: false },
 *     },
 *   }),
 * });
 * ```
 */

import { type AnySchemaModel } from '@contractspec/lib.schema';
import type { OwnerShipMeta } from './ownership';
import type { DocId } from './docs/registry';
import { SpecContractRegistry } from './registry';
import type { CapabilityRef } from './capabilities/capabilities';

// ─────────────────────────────────────────────────────────────────────────────
// Event Spec Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Metadata for an event specification.
 * Extends OwnerShipMeta with event-specific documentation.
 */
export interface EventSpecMeta extends Omit<OwnerShipMeta, 'docId'> {
  /** Associated DocBlock identifiers for this event. */
  docId?: DocId[];
}

/**
 * Typed event specification.
 *
 * Declare once, validate payloads at publish time, and guard emissions
 * via the contracts runtime. Events are the backbone of event-driven
 * architectures in ContractSpec.
 *
 * @typeParam T - The SchemaModel type defining the event payload structure
 */
export interface EventSpec<T extends AnySchemaModel> {
  /** Event metadata including key, version, and ownership. */
  meta: EventSpecMeta;
  /**
   * Optional reference to the capability that provides this event.
   * Used for bidirectional linking between capabilities and events.
   */
  capability?: CapabilityRef;
  /**
   * JSON paths to PII fields that should be redacted in logs/exports.
   * @example ['email', 'user.phone', 'billing.address']
   */
  pii?: string[];
  /** Event payload schema from @contractspec/lib.schema. */
  payload: T;
}

/**
 * Type alias for any EventSpec regardless of payload type.
 * Useful for collections and registries.
 */
export type AnyEventSpec<T extends AnySchemaModel = AnySchemaModel> =
  EventSpec<T>;

/**
 * Identity function to define an event spec with full type inference.
 *
 * @param e - The event specification
 * @returns The same event specification with preserved types
 *
 * @example
 * ```typescript
 * const MyEvent = defineEvent({
 *   meta: { key: 'my.event', version: '1.0.0', ... },
 *   payload: myPayloadSchema,
 * });
 * ```
 */
export function defineEvent<T extends AnySchemaModel>(
  e: EventSpec<T>
): EventSpec<T> {
  return e;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Envelope
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrapper for a published event with metadata.
 *
 * Used when events are serialized for transport or storage.
 * Contains the validated payload plus envelope metadata.
 *
 * @typeParam T - The payload type
 */
export interface EventEnvelope<T> {
  /** Unique identifier for this event instance (UUID recommended). */
  id: string;
  /** ISO 8601 timestamp when the event occurred. */
  occurredAt: string;
  /** Trace identifier for correlating across services. */
  traceId?: string;
  /** Event key (should match spec.meta.key). */
  key: string;
  /** Event version (should match spec.meta.version). */
  version: string;
  /** Validated event payload. */
  payload: T;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Template literal type for event keys.
 * Format: "key.vversion" (e.g., "user.created.v1.0.0")
 */
export type EventKey = `${string}.v${string}`;

/**
 * Builds a stable string key for an event name/version pair.
 *
 * @param key - The event key (e.g., "user.created")
 * @param version - The event version (e.g., "1.0.0")
 * @returns A string in format "key.vversion"
 *
 * @example
 * ```typescript
 * const key = eventKey('user.created', '1.0.0');
 * // "user.created.v1.0.0"
 * ```
 */
export const eventKey = (key: string, version: string): EventKey =>
  `${key}.v${version}`;

/**
 * In-memory registry for EventSpec instances.
 *
 * Provides registration, lookup, and listing of event specifications.
 * Used by the contracts runtime to validate event emissions.
 */
export class EventRegistry extends SpecContractRegistry<'event', AnyEventSpec> {
  public constructor(items?: AnyEventSpec[]) {
    super('event', items);
  }
}

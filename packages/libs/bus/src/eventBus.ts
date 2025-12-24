import {
  type EventEnvelope,
  type EventKey,
  eventKey,
  type EventSpec,
} from '@lssm/lib.contracts';
import type { AnySchemaModel } from '@lssm/lib.schema';

export interface EventBus {
  publish: (topic: EventKey, bytes: Uint8Array) => Promise<void>;
  subscribe: (
    topic: EventKey | string, // allow wildcard if your broker supports it
    handler: (bytes: Uint8Array) => Promise<void>
  ) => Promise<() => Promise<void>>; // returns unsubscribe
}

/** Helper to encode a typed event envelope into JSON string */
export function encodeEvent<T>(envelope: EventEnvelope<T>): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(envelope));
}

/** Helper to decode JSON string into a typed event envelope */
export function decodeEvent<T>(data: Uint8Array): EventEnvelope<T> {
  return JSON.parse(new TextDecoder().decode(data)) as EventEnvelope<T>;
}

/**
 * Create a typed publisher function for a given event spec.
 * It ensures payload conformance at compile time and builds the correct topic.
 */
export function makePublisher<T extends AnySchemaModel>(
  bus: EventBus,
  spec: EventSpec<T>
) {
  return async (payload: T, traceId?: string) => {
    const envelope: EventEnvelope<T> = {
      id: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      name: spec.meta.key,
      version: spec.meta.version,
      payload,
      traceId,
    };
    await bus.publish(
      eventKey(spec.meta.key, spec.meta.version),
      encodeEvent(envelope)
    );
  };
}

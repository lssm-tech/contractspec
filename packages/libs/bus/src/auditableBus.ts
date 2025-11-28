import {
  type EventEnvelope,
  type EventKey,
  eventKey,
  type EventSpec,
} from '@lssm/lib.contracts';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { EventBus } from './eventBus';
import { encodeEvent, decodeEvent } from './eventBus';
import type { EventMetadata } from './metadata';

/**
 * Extended event envelope with metadata for auditing.
 */
export interface AuditableEventEnvelope<T = unknown> extends EventEnvelope<T> {
  metadata?: EventMetadata;
}

/**
 * Audit record for persisting event history.
 */
export interface AuditRecord {
  id: string;
  eventName: string;
  eventVersion: number;
  payload: unknown;
  metadata?: EventMetadata;
  occurredAt: string;
  traceId?: string;
  recordedAt: Date;
}

/**
 * Audit storage adapter interface.
 */
export interface AuditStorage {
  /** Store an audit record */
  store(record: AuditRecord): Promise<void>;
  /** Query audit records */
  query?(options: AuditQueryOptions): Promise<AuditRecord[]>;
}

/**
 * Options for querying audit records.
 */
export interface AuditQueryOptions {
  eventName?: string;
  actorId?: string;
  targetId?: string;
  orgId?: string;
  traceId?: string;
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Options for creating an auditable event bus.
 */
export interface AuditableEventBusOptions {
  /** Underlying event bus for publishing */
  bus: EventBus;
  /** Audit storage adapter */
  storage?: AuditStorage;
  /** Default metadata to include with all events */
  defaultMetadata?: EventMetadata;
  /** Filter function to decide which events to audit */
  shouldAudit?: (eventName: string, envelope: AuditableEventEnvelope) => boolean;
  /** Transform function for audit records */
  transformAuditRecord?: (record: AuditRecord) => AuditRecord;
}

/**
 * AuditableEventBus wraps an EventBus to automatically record events for audit trail.
 */
export class AuditableEventBus implements EventBus {
  private readonly bus: EventBus;
  private readonly storage?: AuditStorage;
  private readonly defaultMetadata: EventMetadata;
  private readonly shouldAudit: (
    eventName: string,
    envelope: AuditableEventEnvelope
  ) => boolean;
  private readonly transformAuditRecord?: (record: AuditRecord) => AuditRecord;

  constructor(options: AuditableEventBusOptions) {
    this.bus = options.bus;
    this.storage = options.storage;
    this.defaultMetadata = options.defaultMetadata ?? {};
    this.shouldAudit = options.shouldAudit ?? (() => true);
    this.transformAuditRecord = options.transformAuditRecord;
  }

  /**
   * Publish an event and optionally record it for audit.
   */
  async publish(topic: EventKey, bytes: Uint8Array): Promise<void> {
    // Publish to underlying bus first
    await this.bus.publish(topic, bytes);

    // Record for audit if storage is configured
    if (this.storage) {
      try {
        const envelope = decodeEvent<unknown>(bytes) as AuditableEventEnvelope;

        if (this.shouldAudit(envelope.name, envelope)) {
          let record: AuditRecord = {
            id: crypto.randomUUID(),
            eventName: envelope.name,
            eventVersion: envelope.version,
            payload: envelope.payload,
            metadata: {
              ...this.defaultMetadata,
              ...envelope.metadata,
            },
            occurredAt: envelope.occurredAt,
            traceId: envelope.traceId,
            recordedAt: new Date(),
          };

          if (this.transformAuditRecord) {
            record = this.transformAuditRecord(record);
          }

          await this.storage.store(record);
        }
      } catch (error) {
        // Log but don't fail publishing if audit fails
        console.error('Failed to record audit:', error);
      }
    }
  }

  /**
   * Subscribe to events from the underlying bus.
   */
  async subscribe(
    topic: EventKey | string,
    handler: (bytes: Uint8Array) => Promise<void>
  ): Promise<() => Promise<void>> {
    return this.bus.subscribe(topic, handler);
  }

  /**
   * Query audit records (if storage supports it).
   */
  async queryAudit(options: AuditQueryOptions): Promise<AuditRecord[]> {
    if (!this.storage?.query) {
      throw new Error('Audit storage does not support querying');
    }
    return this.storage.query(options);
  }
}

/**
 * Create an auditable publisher that includes metadata.
 */
export function makeAuditablePublisher<T extends AnySchemaModel>(
  bus: AuditableEventBus | EventBus,
  spec: EventSpec<T>,
  defaultMetadata?: EventMetadata
) {
  return async (
    payload: T,
    options?: { traceId?: string; metadata?: EventMetadata }
  ) => {
    const envelope: AuditableEventEnvelope<T> = {
      id: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      name: spec.name,
      version: spec.version,
      payload,
      traceId: options?.traceId,
      metadata: {
        ...defaultMetadata,
        ...options?.metadata,
      },
    };
    await bus.publish(
      eventKey(spec.name, spec.version),
      encodeEvent(envelope)
    );
  };
}

/**
 * In-memory audit storage for development/testing.
 */
export class InMemoryAuditStorage implements AuditStorage {
  private records: AuditRecord[] = [];

  async store(record: AuditRecord): Promise<void> {
    this.records.push(record);
  }

  async query(options: AuditQueryOptions): Promise<AuditRecord[]> {
    let results = [...this.records];

    if (options.eventName) {
      results = results.filter((r) => r.eventName === options.eventName);
    }

    if (options.actorId) {
      results = results.filter((r) => r.metadata?.actorId === options.actorId);
    }

    if (options.targetId) {
      results = results.filter((r) => r.metadata?.targetId === options.targetId);
    }

    if (options.orgId) {
      results = results.filter((r) => r.metadata?.orgId === options.orgId);
    }

    if (options.traceId) {
      results = results.filter((r) => r.traceId === options.traceId);
    }

    if (options.from) {
      results = results.filter(
        (r) => new Date(r.occurredAt) >= options.from!
      );
    }

    if (options.to) {
      results = results.filter((r) => new Date(r.occurredAt) <= options.to!);
    }

    // Sort by occurredAt descending
    results.sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );

    // Apply pagination
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 100;
    return results.slice(offset, offset + limit);
  }

  /**
   * Get all records (for testing).
   */
  getAll(): AuditRecord[] {
    return [...this.records];
  }

  /**
   * Clear all records (for testing).
   */
  clear(): void {
    this.records = [];
  }
}

/**
 * Create an auditable event bus with in-memory storage.
 */
export function createAuditableEventBus(
  bus: EventBus,
  options?: Omit<AuditableEventBusOptions, 'bus'>
): AuditableEventBus {
  return new AuditableEventBus({
    bus,
    storage: options?.storage ?? new InMemoryAuditStorage(),
    ...options,
  });
}


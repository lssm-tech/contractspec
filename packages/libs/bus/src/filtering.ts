import type { EventKey, EventSpec } from '@contractspec/lib.contracts-spec';
import type { AnySchemaModel } from '@contractspec/lib.schema';
import type { EventBus } from './eventBus';
import { decodeEvent } from './eventBus';
import type { AuditableEventEnvelope } from './auditableBus';
import { satisfies } from 'compare-versions';

/**
 * Event filter configuration.
 */
export interface EventFilter {
  /** Filter by event name pattern (supports * wildcard) */
  eventName?: string;
  /** Filter by domain prefix */
  domain?: string;
  /** Filter by version */
  version?: string;
  /** Filter by actor ID */
  actorId?: string;
  /** Filter by organization ID */
  orgId?: string;
  /** Filter by custom tags */
  tags?: Record<string, string>;
  /** Custom predicate function */
  predicate?: (envelope: AuditableEventEnvelope) => boolean;
}

/**
 * Check if an event matches a filter.
 */
export function matchesFilter(
  envelope: AuditableEventEnvelope,
  filter: EventFilter
): boolean {
  // Check event name pattern
  if (filter.eventName) {
    const pattern = filter.eventName.replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);
    if (!regex.test(envelope.key)) {
      return false;
    }
  }

  // Check domain prefix
  if (filter.domain) {
    if (!envelope.key.startsWith(filter.domain + '.')) {
      return false;
    }
  }

  // Check version
  if (filter.version) {
    if (!envelope.version || !satisfies(envelope.version, filter.version)) {
      return false;
    }
  }

  // Check metadata fields
  if (filter.actorId && envelope.metadata?.actorId !== filter.actorId) {
    return false;
  }

  if (filter.orgId && envelope.metadata?.orgId !== filter.orgId) {
    return false;
  }

  // Check tags
  if (filter.tags) {
    const eventTags = envelope.metadata?.tags ?? {};
    for (const [key, value] of Object.entries(filter.tags)) {
      if (eventTags[key] !== value) {
        return false;
      }
    }
  }

  // Custom predicate
  if (filter.predicate && !filter.predicate(envelope)) {
    return false;
  }

  return true;
}

/**
 * Create a filtered subscriber that only receives matching events.
 */
export function createFilteredSubscriber(
  bus: EventBus,
  filter: EventFilter,
  handler: (envelope: AuditableEventEnvelope) => Promise<void>
) {
  return async (topic: EventKey | string) => {
    return bus.subscribe(topic, async (bytes) => {
      const envelope = decodeEvent<unknown>(bytes) as AuditableEventEnvelope;

      if (matchesFilter(envelope, filter)) {
        await handler(envelope);
      }
    });
  };
}

/**
 * Domain-specific event bus that filters by domain prefix.
 */
export class DomainEventBus {
  constructor(
    private readonly bus: EventBus,
    private readonly domain: string
  ) {}

  /**
   * Publish a domain event.
   */
  async publish<T extends AnySchemaModel>(
    spec: EventSpec<T>,
    payload: T,
    metadata?: AuditableEventEnvelope['metadata']
  ): Promise<void> {
    // Ensure event name starts with domain
    const eventName = spec.meta.key.startsWith(this.domain + '.')
      ? spec.meta.key
      : `${this.domain}.${spec.meta.key}`;

    const envelope: AuditableEventEnvelope<T> = {
      id: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      key: eventName,
      version: spec.meta.version,
      payload,
      metadata,
    };

    const bytes = new TextEncoder().encode(JSON.stringify(envelope));
    await this.bus.publish(`${eventName}.v${spec.meta.version}`, bytes);
  }

  /**
   * Subscribe to all domain events.
   */
  async subscribeAll(
    handler: (envelope: AuditableEventEnvelope) => Promise<void>
  ): Promise<() => Promise<void>> {
    // Subscribe to wildcard pattern if supported
    return this.bus.subscribe(`${this.domain}.*`, async (bytes) => {
      const envelope = decodeEvent<unknown>(bytes) as AuditableEventEnvelope;
      await handler(envelope);
    });
  }

  /**
   * Subscribe with filter.
   */
  async subscribeFiltered(
    filter: Omit<EventFilter, 'domain'>,
    handler: (envelope: AuditableEventEnvelope) => Promise<void>
  ): Promise<() => Promise<void>> {
    const fullFilter: EventFilter = {
      ...filter,
      domain: this.domain,
    };

    return this.bus.subscribe(`${this.domain}.*`, async (bytes) => {
      const envelope = decodeEvent<unknown>(bytes) as AuditableEventEnvelope;

      if (matchesFilter(envelope, fullFilter)) {
        await handler(envelope);
      }
    });
  }
}

/**
 * Create a domain-scoped event bus.
 */
export function createDomainBus(bus: EventBus, domain: string): DomainEventBus {
  return new DomainEventBus(bus, domain);
}

/**
 * Event router that routes events to different handlers based on filters.
 */
export class EventRouter {
  private routes: {
    filter: EventFilter;
    handler: (envelope: AuditableEventEnvelope) => Promise<void>;
  }[] = [];

  /**
   * Add a route.
   */
  route(
    filter: EventFilter,
    handler: (envelope: AuditableEventEnvelope) => Promise<void>
  ): this {
    this.routes.push({ filter, handler });
    return this;
  }

  /**
   * Route an event to matching handlers.
   */
  async dispatch(envelope: AuditableEventEnvelope): Promise<void> {
    const matchingRoutes = this.routes.filter((r) =>
      matchesFilter(envelope, r.filter)
    );

    await Promise.all(matchingRoutes.map((r) => r.handler(envelope)));
  }

  /**
   * Create a subscriber that routes events.
   */
  createSubscriber(
    bus: EventBus
  ): (topic: EventKey | string) => Promise<() => Promise<void>> {
    return async (topic: EventKey | string) => {
      return bus.subscribe(topic, async (bytes) => {
        const envelope = decodeEvent<unknown>(bytes) as AuditableEventEnvelope;
        await this.dispatch(envelope);
      });
    };
  }
}

/**
 * Create an event router.
 */
export function createEventRouter(): EventRouter {
  return new EventRouter();
}

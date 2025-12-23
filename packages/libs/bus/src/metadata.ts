/**
 * Event metadata that enriches events with contextual information.
 */
export interface EventMetadata {
  /** ID of the actor (user) who triggered the event */
  actorId?: string;
  /** Type of actor (user, system, service) */
  actorType?: 'user' | 'system' | 'service';
  /** Target resource ID */
  targetId?: string;
  /** Target resource type */
  targetType?: string;
  /** Organization context */
  orgId?: string;
  /** Tenant context (if different from org) */
  tenantId?: string;
  /** Distributed trace ID */
  traceId?: string;
  /** Parent span ID */
  spanId?: string;
  /** Client IP address */
  clientIp?: string;
  /** Client user agent */
  userAgent?: string;
  /** Session ID */
  sessionId?: string;
  /** Request ID */
  requestId?: string;
  /** Source service name */
  source?: string;
  /** Correlation ID for related events */
  correlationId?: string;
  /** Custom tags for filtering/routing */
  tags?: Record<string, string>;
}

/**
 * Create metadata from request context.
 */
export function createMetadataFromContext(context: {
  userId?: string;
  orgId?: string;
  sessionId?: string;
  requestId?: string;
  traceId?: string;
  clientIp?: string;
  userAgent?: string;
}): EventMetadata {
  return {
    actorId: context.userId,
    actorType: context.userId ? 'user' : 'system',
    orgId: context.orgId,
    tenantId: context.orgId,
    sessionId: context.sessionId,
    requestId: context.requestId,
    traceId: context.traceId || crypto.randomUUID(),
    clientIp: context.clientIp,
    userAgent: context.userAgent,
  };
}

/**
 * Merge metadata with overrides.
 */
export function mergeMetadata(
  base: EventMetadata,
  overrides: Partial<EventMetadata>
): EventMetadata {
  return {
    ...base,
    ...overrides,
    tags: {
      ...base.tags,
      ...overrides.tags,
    },
  };
}

/**
 * Create a metadata context that can be passed through operations.
 */
export class MetadataContext {
  private metadata: EventMetadata;

  constructor(initial: EventMetadata = {}) {
    this.metadata = { ...initial };
    if (!this.metadata.traceId) {
      this.metadata.traceId = crypto.randomUUID();
    }
  }

  /**
   * Get the current metadata.
   */
  get(): EventMetadata {
    return { ...this.metadata };
  }

  /**
   * Set a metadata value.
   */
  set<K extends keyof EventMetadata>(key: K, value: EventMetadata[K]): this {
    this.metadata[key] = value;
    return this;
  }

  /**
   * Add a tag.
   */
  tag(key: string, value: string): this {
    this.metadata.tags = { ...this.metadata.tags, [key]: value };
    return this;
  }

  /**
   * Create a child context with the same trace.
   */
  child(overrides: Partial<EventMetadata> = {}): MetadataContext {
    return new MetadataContext(
      mergeMetadata(this.metadata, {
        ...overrides,
        spanId: crypto.randomUUID(),
      })
    );
  }
}

/**
 * Create a new metadata context.
 */
export function createMetadataContext(
  initial?: EventMetadata
): MetadataContext {
  return new MetadataContext(initial);
}

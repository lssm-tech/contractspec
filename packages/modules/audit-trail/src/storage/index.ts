import type { AuditRecord, AuditQueryOptions, AuditStorage } from '@lssm/lib.bus';

/**
 * Extended query options for audit storage.
 */
export interface ExtendedAuditQueryOptions extends AuditQueryOptions {
  targetType?: string;
  clientIp?: string;
  sessionId?: string;
  orderBy?: 'occurredAt' | 'recordedAt';
  orderDir?: 'asc' | 'desc';
}

/**
 * Audit storage adapter interface with extended capabilities.
 */
export interface AuditStorageAdapter extends AuditStorage {
  /** Query audit records with extended options */
  query(options: ExtendedAuditQueryOptions): Promise<AuditRecord[]>;
  /** Count matching records */
  count(options: Omit<ExtendedAuditQueryOptions, 'limit' | 'offset'>): Promise<number>;
  /** Get a single record by ID */
  getById(id: string): Promise<AuditRecord | null>;
  /** Get all records for a trace */
  getByTraceId(traceId: string): Promise<AuditRecord[]>;
  /** Delete old records (for retention) */
  deleteOlderThan(date: Date): Promise<number>;
}

/**
 * In-memory audit storage for development/testing.
 */
export class InMemoryAuditStorage implements AuditStorageAdapter {
  private records: AuditRecord[] = [];

  async store(record: AuditRecord): Promise<void> {
    this.records.push(record);
  }

  async query(options: ExtendedAuditQueryOptions): Promise<AuditRecord[]> {
    let results = [...this.records];

    // Apply filters
    if (options.eventName) {
      const pattern = options.eventName.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      results = results.filter((r) => regex.test(r.eventName));
    }

    if (options.actorId) {
      results = results.filter((r) => r.metadata?.actorId === options.actorId);
    }

    if (options.targetId) {
      results = results.filter((r) => r.metadata?.targetId === options.targetId);
    }

    if (options.targetType) {
      results = results.filter((r) => r.metadata?.targetType === options.targetType);
    }

    if (options.orgId) {
      results = results.filter((r) => r.metadata?.orgId === options.orgId);
    }

    if (options.traceId) {
      results = results.filter((r) => r.traceId === options.traceId);
    }

    if (options.from) {
      results = results.filter((r) => new Date(r.occurredAt) >= options.from!);
    }

    if (options.to) {
      results = results.filter((r) => new Date(r.occurredAt) <= options.to!);
    }

    // Sort
    const orderBy = options.orderBy ?? 'occurredAt';
    const orderDir = options.orderDir ?? 'desc';
    results.sort((a, b) => {
      const aTime = orderBy === 'occurredAt'
        ? new Date(a.occurredAt).getTime()
        : a.recordedAt.getTime();
      const bTime = orderBy === 'occurredAt'
        ? new Date(b.occurredAt).getTime()
        : b.recordedAt.getTime();
      return orderDir === 'desc' ? bTime - aTime : aTime - bTime;
    });

    // Paginate
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 100;
    return results.slice(offset, offset + limit);
  }

  async count(
    options: Omit<ExtendedAuditQueryOptions, 'limit' | 'offset'>
  ): Promise<number> {
    const results = await this.query({ ...options, limit: Infinity });
    return results.length;
  }

  async getById(id: string): Promise<AuditRecord | null> {
    return this.records.find((r) => r.id === id) ?? null;
  }

  async getByTraceId(traceId: string): Promise<AuditRecord[]> {
    return this.query({ traceId });
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const before = this.records.length;
    this.records = this.records.filter(
      (r) => new Date(r.occurredAt) >= date
    );
    return before - this.records.length;
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
 * Retention policy configuration.
 */
export interface RetentionPolicyConfig {
  /** Days to keep detailed logs */
  hotRetentionDays: number;
  /** Days to keep archived logs (for compliance) */
  archiveRetentionDays?: number;
  /** Cron expression for cleanup schedule */
  cleanupSchedule?: string;
}

/**
 * Retention policy manager.
 */
export class RetentionPolicy {
  constructor(private readonly config: RetentionPolicyConfig) {}

  /**
   * Get the cutoff date for hot storage.
   */
  getHotCutoff(): Date {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - this.config.hotRetentionDays);
    return cutoff;
  }

  /**
   * Get the cutoff date for archive storage.
   */
  getArchiveCutoff(): Date | null {
    if (!this.config.archiveRetentionDays) return null;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - this.config.archiveRetentionDays);
    return cutoff;
  }

  /**
   * Apply retention policy to storage.
   */
  async apply(storage: AuditStorageAdapter): Promise<{
    deletedCount: number;
  }> {
    const cutoff = this.getHotCutoff();
    const deletedCount = await storage.deleteOlderThan(cutoff);
    return { deletedCount };
  }
}

/**
 * Create an in-memory audit storage.
 */
export function createInMemoryAuditStorage(): InMemoryAuditStorage {
  return new InMemoryAuditStorage();
}


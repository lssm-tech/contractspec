/**
 * Usage aggregation engine.
 *
 * Provides periodic aggregation of usage records into summaries
 * for efficient billing and reporting queries.
 */

// ============ Types ============

export type PeriodType = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type AggregationType = 'COUNT' | 'SUM' | 'AVG' | 'MAX' | 'MIN' | 'LAST';

export interface UsageRecord {
  id: string;
  metricKey: string;
  subjectType: string;
  subjectId: string;
  quantity: number;
  timestamp: Date;
}

export interface UsageSummary {
  id: string;
  metricKey: string;
  subjectType: string;
  subjectId: string;
  periodType: PeriodType;
  periodStart: Date;
  periodEnd: Date;
  totalQuantity: number;
  recordCount: number;
  minQuantity?: number;
  maxQuantity?: number;
  avgQuantity?: number;
}

export interface MetricDefinition {
  key: string;
  aggregationType: AggregationType;
}

export interface UsageStorage {
  /**
   * Get unaggregated records for a period.
   */
  getUnaggregatedRecords(options: {
    metricKey?: string;
    periodStart: Date;
    periodEnd: Date;
    limit?: number;
  }): Promise<UsageRecord[]>;

  /**
   * Mark records as aggregated.
   */
  markRecordsAggregated(recordIds: string[], aggregatedAt: Date): Promise<void>;

  /**
   * Get or create a summary record.
   */
  upsertSummary(summary: Omit<UsageSummary, 'id'>): Promise<UsageSummary>;

  /**
   * Get metric definition.
   */
  getMetric(key: string): Promise<MetricDefinition | null>;

  /**
   * List all active metrics.
   */
  listMetrics(): Promise<MetricDefinition[]>;
}

export interface AggregationOptions {
  /** Storage implementation */
  storage: UsageStorage;
  /** Batch size for processing records */
  batchSize?: number;
}

export interface AggregateParams {
  /** Period type to aggregate */
  periodType: PeriodType;
  /** Period start time */
  periodStart: Date;
  /** Period end time (optional, defaults to period boundary) */
  periodEnd?: Date;
  /** Specific metric to aggregate (optional, aggregates all if not specified) */
  metricKey?: string;
}

export interface AggregationResult {
  periodType: PeriodType;
  periodStart: Date;
  periodEnd: Date;
  recordsProcessed: number;
  summariesCreated: number;
  summariesUpdated: number;
  errors: AggregationError[];
}

export interface AggregationError {
  metricKey: string;
  subjectType: string;
  subjectId: string;
  error: string;
}

// ============ Period Helpers ============

/**
 * Get the start of a period for a given date.
 */
export function getPeriodStart(date: Date, periodType: PeriodType): Date {
  const d = new Date(date);

  switch (periodType) {
    case 'HOURLY':
      d.setMinutes(0, 0, 0);
      return d;

    case 'DAILY':
      d.setHours(0, 0, 0, 0);
      return d;

    case 'WEEKLY':
      d.setHours(0, 0, 0, 0);
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      return d;

    case 'MONTHLY':
      d.setHours(0, 0, 0, 0);
      d.setDate(1);
      return d;

    case 'YEARLY':
      d.setHours(0, 0, 0, 0);
      d.setMonth(0, 1);
      return d;
  }
}

/**
 * Get the end of a period for a given date.
 */
export function getPeriodEnd(date: Date, periodType: PeriodType): Date {
  const start = getPeriodStart(date, periodType);

  switch (periodType) {
    case 'HOURLY':
      return new Date(start.getTime() + 60 * 60 * 1000);

    case 'DAILY':
      return new Date(start.getTime() + 24 * 60 * 60 * 1000);

    case 'WEEKLY':
      return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    case 'MONTHLY': {
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      return end;
    }

    case 'YEARLY': {
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      return end;
    }
  }
}

/**
 * Format a period key for grouping.
 */
export function formatPeriodKey(date: Date, periodType: PeriodType): string {
  const start = getPeriodStart(date, periodType);
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const day = String(start.getDate()).padStart(2, '0');
  const hour = String(start.getHours()).padStart(2, '0');

  switch (periodType) {
    case 'HOURLY':
      return `${year}-${month}-${day}T${hour}`;
    case 'DAILY':
      return `${year}-${month}-${day}`;
    case 'WEEKLY':
      return `${year}-W${getWeekNumber(start)}`;
    case 'MONTHLY':
      return `${year}-${month}`;
    case 'YEARLY':
      return `${year}`;
  }
}

function getWeekNumber(date: Date): string {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return String(weekNum).padStart(2, '0');
}

// ============ Aggregator ============

/**
 * Usage aggregator.
 *
 * Aggregates usage records into summaries based on period type.
 */
export class UsageAggregator {
  private storage: UsageStorage;
  private batchSize: number;

  constructor(options: AggregationOptions) {
    this.storage = options.storage;
    this.batchSize = options.batchSize || 1000;
  }

  /**
   * Aggregate usage records for a period.
   */
  async aggregate(params: AggregateParams): Promise<AggregationResult> {
    const { periodType, periodStart, metricKey } = params;
    const periodEnd = params.periodEnd || getPeriodEnd(periodStart, periodType);

    const result: AggregationResult = {
      periodType,
      periodStart,
      periodEnd,
      recordsProcessed: 0,
      summariesCreated: 0,
      summariesUpdated: 0,
      errors: [],
    };

    // Get records to aggregate
    const records = await this.storage.getUnaggregatedRecords({
      metricKey,
      periodStart,
      periodEnd,
      limit: this.batchSize,
    });

    if (records.length === 0) {
      return result;
    }

    // Group records by metric, subject, and period
    const groups = this.groupRecords(records, periodType);

    // Process each group
    for (const [groupKey, groupRecords] of groups.entries()) {
      try {
        await this.aggregateGroup(groupKey, groupRecords, periodType, result);
      } catch (error) {
        const [metricKey, subjectType, subjectId] = groupKey.split('::');
        result.errors.push({
          metricKey: metricKey!,
          subjectType: subjectType!,
          subjectId: subjectId!,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Mark records as aggregated
    const recordIds = records.map((r) => r.id);
    await this.storage.markRecordsAggregated(recordIds, new Date());
    result.recordsProcessed = records.length;

    return result;
  }

  /**
   * Group records by metric, subject, and period.
   */
  private groupRecords(
    records: UsageRecord[],
    periodType: PeriodType
  ): Map<string, UsageRecord[]> {
    const groups = new Map<string, UsageRecord[]>();

    for (const record of records) {
      const periodKey = formatPeriodKey(record.timestamp, periodType);
      const groupKey = `${record.metricKey}::${record.subjectType}::${record.subjectId}::${periodKey}`;

      const existing = groups.get(groupKey) || [];
      existing.push(record);
      groups.set(groupKey, existing);
    }

    return groups;
  }

  /**
   * Aggregate a group of records into a summary.
   */
  private async aggregateGroup(
    groupKey: string,
    records: UsageRecord[],
    periodType: PeriodType,
    result: AggregationResult
  ): Promise<void> {
    const [metricKey, subjectType, subjectId] = groupKey.split('::');

    if (!metricKey || !subjectType || !subjectId || records.length === 0) {
      return;
    }

    const firstRecord = records[0]!;
    const periodStart = getPeriodStart(firstRecord.timestamp, periodType);
    const periodEnd = getPeriodEnd(firstRecord.timestamp, periodType);

    // Get metric definition for aggregation type
    const metric = await this.storage.getMetric(metricKey);
    const aggregationType = metric?.aggregationType || 'SUM';

    // Calculate aggregated values
    const quantities = records.map((r) => r.quantity);
    const aggregated = this.calculateAggregation(quantities, aggregationType);

    // Create or update summary
    await this.storage.upsertSummary({
      metricKey,
      subjectType,
      subjectId,
      periodType,
      periodStart,
      periodEnd,
      totalQuantity: aggregated.total,
      recordCount: records.length,
      minQuantity: aggregated.min,
      maxQuantity: aggregated.max,
      avgQuantity: aggregated.avg,
    });

    result.summariesCreated++;
  }

  /**
   * Calculate aggregation values.
   */
  private calculateAggregation(
    quantities: number[],
    aggregationType: AggregationType
  ): { total: number; min: number; max: number; avg: number } {
    if (quantities.length === 0) {
      return { total: 0, min: 0, max: 0, avg: 0 };
    }

    const min = Math.min(...quantities);
    const max = Math.max(...quantities);
    const sum = quantities.reduce((a, b) => a + b, 0);
    const avg = sum / quantities.length;
    const count = quantities.length;

    let total: number;
    switch (aggregationType) {
      case 'COUNT':
        total = count;
        break;
      case 'SUM':
        total = sum;
        break;
      case 'AVG':
        total = avg;
        break;
      case 'MAX':
        total = max;
        break;
      case 'MIN':
        total = min;
        break;
      case 'LAST':
        total = quantities[quantities.length - 1] ?? 0;
        break;
      default:
        total = sum;
    }

    return { total, min, max, avg };
  }
}

// ============ In-Memory Storage ============

/**
 * In-memory usage storage for testing.
 */
export class InMemoryUsageStorage implements UsageStorage {
  private records: UsageRecord[] = [];
  private summaries = new Map<string, UsageSummary>();
  private metrics = new Map<string, MetricDefinition>();

  addRecord(record: UsageRecord): void {
    this.records.push(record);
  }

  addMetric(metric: MetricDefinition): void {
    this.metrics.set(metric.key, metric);
  }

  async getUnaggregatedRecords(options: {
    metricKey?: string;
    periodStart: Date;
    periodEnd: Date;
    limit?: number;
  }): Promise<UsageRecord[]> {
    let records = this.records.filter((r) => {
      const inPeriod =
        r.timestamp >= options.periodStart && r.timestamp < options.periodEnd;
      const matchesMetric =
        !options.metricKey || r.metricKey === options.metricKey;
      return inPeriod && matchesMetric;
    });

    if (options.limit) {
      records = records.slice(0, options.limit);
    }

    return records;
  }

  async markRecordsAggregated(recordIds: string[]): Promise<void> {
    this.records = this.records.filter((r) => !recordIds.includes(r.id));
  }

  async upsertSummary(
    summary: Omit<UsageSummary, 'id'>
  ): Promise<UsageSummary> {
    const key = `${summary.metricKey}::${summary.subjectType}::${summary.subjectId}::${summary.periodType}::${summary.periodStart.toISOString()}`;

    const existing = this.summaries.get(key);
    if (existing) {
      // Update existing summary
      existing.totalQuantity += summary.totalQuantity;
      existing.recordCount += summary.recordCount;
      if (summary.minQuantity !== undefined) {
        existing.minQuantity = Math.min(
          existing.minQuantity ?? Infinity,
          summary.minQuantity
        );
      }
      if (summary.maxQuantity !== undefined) {
        existing.maxQuantity = Math.max(
          existing.maxQuantity ?? -Infinity,
          summary.maxQuantity
        );
      }
      return existing;
    }

    // Create new summary
    const newSummary: UsageSummary = {
      id: `summary-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...summary,
    };
    this.summaries.set(key, newSummary);
    return newSummary;
  }

  async getMetric(key: string): Promise<MetricDefinition | null> {
    return this.metrics.get(key) || null;
  }

  async listMetrics(): Promise<MetricDefinition[]> {
    return Array.from(this.metrics.values());
  }

  getSummaries(): UsageSummary[] {
    return Array.from(this.summaries.values());
  }

  clear(): void {
    this.records = [];
    this.summaries.clear();
    this.metrics.clear();
  }
}


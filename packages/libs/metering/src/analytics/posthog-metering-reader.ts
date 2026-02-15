import type {
  AnalyticsReader,
  AnalyticsQueryResult,
  DateRangeInput,
} from '@contractspec/lib.contracts-integrations';
import type {
  MeteringUsageAggregate,
  MeteringUsageRecord,
} from './posthog-metering';

export interface UsageByMetricInput {
  metricKey: string;
  dateRange?: DateRangeInput;
  subjectId?: string;
  limit?: number;
}

export interface UsageSummaryInput {
  metricKey: string;
  subjectId?: string;
  periodType?: string;
  dateRange?: DateRangeInput;
  limit?: number;
}

export type UsageTrendBucket = 'hour' | 'day' | 'week' | 'month';

export interface UsageTrendInput {
  metricKey: string;
  bucket: UsageTrendBucket;
  dateRange?: DateRangeInput;
}

export interface MeteringUsageTrendPoint {
  bucketStart: string;
  totalQuantity: number;
  recordCount: number;
}

export interface PosthogMeteringReaderOptions {
  eventPrefix?: string;
}

export class PosthogMeteringReader {
  private readonly reader: AnalyticsReader;
  private readonly eventPrefix: string;

  constructor(
    reader: AnalyticsReader,
    options: PosthogMeteringReaderOptions = {}
  ) {
    this.reader = reader;
    this.eventPrefix = options.eventPrefix ?? 'metering';
  }

  async getUsageByMetric(
    input: UsageByMetricInput
  ): Promise<MeteringUsageRecord[]> {
    const result = await this.queryHogQL({
      query: [
        'select',
        '  properties.recordId as recordId,',
        '  properties.metricKey as metricKey,',
        '  properties.subjectType as subjectType,',
        '  distinct_id as subjectId,',
        '  properties.quantity as quantity,',
        '  properties.source as source,',
        '  timestamp as timestamp',
        'from events',
        `where ${buildUsageWhereClause(this.eventPrefix, input)}`,
        'order by timestamp desc',
        `limit ${input.limit ?? 200}`,
      ].join('\n'),
      values: buildUsageValues(input),
    });

    return mapUsageRecords(result);
  }

  async getUsageSummary(
    input: UsageSummaryInput
  ): Promise<MeteringUsageAggregate[]> {
    const result = await this.queryHogQL({
      query: [
        'select',
        '  properties.summaryId as summaryId,',
        '  properties.metricKey as metricKey,',
        '  properties.subjectType as subjectType,',
        '  distinct_id as subjectId,',
        '  properties.periodType as periodType,',
        '  properties.periodStart as periodStart,',
        '  properties.periodEnd as periodEnd,',
        '  properties.totalQuantity as totalQuantity,',
        '  properties.recordCount as recordCount,',
        '  timestamp as aggregatedAt',
        'from events',
        `where ${buildSummaryWhereClause(this.eventPrefix, input)}`,
        'order by timestamp desc',
        `limit ${input.limit ?? 200}`,
      ].join('\n'),
      values: buildSummaryValues(input),
    });

    return mapUsageSummaries(result);
  }

  async getUsageTrend(
    input: UsageTrendInput
  ): Promise<MeteringUsageTrendPoint[]> {
    const result = await this.queryHogQL({
      query: [
        'select',
        `  ${bucketExpression(input.bucket)} as bucketStart,`,
        '  sum(properties.quantity) as totalQuantity,',
        '  count() as recordCount',
        'from events',
        `where ${buildUsageWhereClause(this.eventPrefix, input)}`,
        'group by bucketStart',
        'order by bucketStart asc',
      ].join('\n'),
      values: buildUsageValues(input),
    });

    return mapUsageTrend(result);
  }

  private async queryHogQL(input: {
    query: string;
    values: Record<string, unknown>;
  }): Promise<AnalyticsQueryResult> {
    if (!this.reader.queryHogQL) {
      throw new Error('Analytics reader does not support HogQL queries.');
    }
    return this.reader.queryHogQL(input);
  }
}

function buildUsageWhereClause(
  eventPrefix: string,
  input: { dateRange?: DateRangeInput; metricKey: string; subjectId?: string }
): string {
  const clauses = [
    `event = '${eventPrefix}.usage_recorded'`,
    `properties.metricKey = {metricKey}`,
  ];
  if (input.subjectId) {
    clauses.push('distinct_id = {subjectId}');
  }
  if (input.dateRange?.from) {
    clauses.push('timestamp >= {dateFrom}');
  }
  if (input.dateRange?.to) {
    clauses.push('timestamp < {dateTo}');
  }
  return clauses.join(' and ');
}

function buildSummaryWhereClause(
  eventPrefix: string,
  input: {
    dateRange?: DateRangeInput;
    metricKey: string;
    subjectId?: string;
    periodType?: string;
  }
): string {
  const clauses = [
    `event = '${eventPrefix}.usage_aggregated'`,
    `properties.metricKey = {metricKey}`,
  ];
  if (input.subjectId) {
    clauses.push('distinct_id = {subjectId}');
  }
  if (input.periodType) {
    clauses.push('properties.periodType = {periodType}');
  }
  if (input.dateRange?.from) {
    clauses.push('timestamp >= {dateFrom}');
  }
  if (input.dateRange?.to) {
    clauses.push('timestamp < {dateTo}');
  }
  return clauses.join(' and ');
}

function buildUsageValues(input: {
  metricKey: string;
  subjectId?: string;
  dateRange?: DateRangeInput;
}): Record<string, unknown> {
  return {
    metricKey: input.metricKey,
    subjectId: input.subjectId,
    dateFrom: toIsoString(input.dateRange?.from),
    dateTo: toIsoString(input.dateRange?.to),
  };
}

function buildSummaryValues(input: {
  metricKey: string;
  subjectId?: string;
  periodType?: string;
  dateRange?: DateRangeInput;
}): Record<string, unknown> {
  return {
    metricKey: input.metricKey,
    subjectId: input.subjectId,
    periodType: input.periodType,
    dateFrom: toIsoString(input.dateRange?.from),
    dateTo: toIsoString(input.dateRange?.to),
  };
}

function bucketExpression(bucket: UsageTrendBucket): string {
  switch (bucket) {
    case 'hour':
      return 'toStartOfHour(timestamp)';
    case 'week':
      return 'toStartOfWeek(timestamp)';
    case 'month':
      return 'toStartOfMonth(timestamp)';
    case 'day':
    default:
      return 'toStartOfDay(timestamp)';
  }
}

function mapUsageRecords(result: AnalyticsQueryResult): MeteringUsageRecord[] {
  const rows = mapRows(result);
  return rows.flatMap((row) => {
    const metricKey = asString(row.metricKey);
    const subjectType = asString(row.subjectType);
    const subjectId = asString(row.subjectId);
    const timestamp = asDate(row.timestamp);
    if (!metricKey || !subjectType || !subjectId || !timestamp) {
      return [];
    }
    return [
      {
        recordId: asOptionalString(row.recordId),
        metricKey,
        subjectType,
        subjectId,
        quantity: asNumber(row.quantity),
        source: asOptionalString(row.source),
        timestamp,
      },
    ];
  });
}

function mapUsageSummaries(
  result: AnalyticsQueryResult
): MeteringUsageAggregate[] {
  const rows = mapRows(result);
  return rows.flatMap((row) => {
    const metricKey = asString(row.metricKey);
    const subjectType = asString(row.subjectType);
    const subjectId = asString(row.subjectId);
    const periodType = asString(row.periodType);
    const periodStart = asDate(row.periodStart);
    const periodEnd = asDate(row.periodEnd);
    const aggregatedAt = asDate(row.aggregatedAt);
    if (
      !metricKey ||
      !subjectType ||
      !subjectId ||
      !periodType ||
      !periodStart ||
      !periodEnd ||
      !aggregatedAt
    ) {
      return [];
    }
    return [
      {
        summaryId: asOptionalString(row.summaryId),
        metricKey,
        subjectType,
        subjectId,
        periodType,
        periodStart,
        periodEnd,
        totalQuantity: asNumber(row.totalQuantity),
        recordCount: asNumber(row.recordCount),
        aggregatedAt,
      },
    ];
  });
}

function mapUsageTrend(
  result: AnalyticsQueryResult
): MeteringUsageTrendPoint[] {
  const rows = mapRows(result);
  return rows.flatMap((row) => {
    const bucketStart = asString(row.bucketStart);
    if (!bucketStart) return [];
    return [
      {
        bucketStart,
        totalQuantity: asNumber(row.totalQuantity),
        recordCount: asNumber(row.recordCount),
      },
    ];
  });
}

function mapRows(result: AnalyticsQueryResult): Record<string, unknown>[] {
  if (!Array.isArray(result.results) || !Array.isArray(result.columns)) {
    return [];
  }
  const columns = result.columns;
  return result.results.flatMap((row) => {
    if (!Array.isArray(row)) return [];
    const record: Record<string, unknown> = {};
    columns.forEach((column, index) => {
      record[column] = row[index];
    });
    return [record];
  });
}

function asString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);
  return null;
}

function asOptionalString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
}

function asNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function asDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

function toIsoString(value?: string | Date): string | undefined {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value.toISOString();
}

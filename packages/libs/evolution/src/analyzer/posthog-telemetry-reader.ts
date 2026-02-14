import type {
  AnalyticsReader,
  AnalyticsQueryResult,
  DateRangeInput,
} from '@contractspec/lib.contracts-integrations';
import type {
  OperationCoordinate,
  OperationMetricSample,
  SpecUsageStats,
} from '../types';

export interface ReadOperationSamplesInput {
  operations?: OperationCoordinate[];
  dateRange?: DateRangeInput;
  limit?: number;
}

export interface PosthogTelemetryReaderOptions {
  eventPrefix?: string;
}

export class PosthogTelemetryReader {
  private readonly reader: AnalyticsReader;
  private readonly eventPrefix: string;

  constructor(
    reader: AnalyticsReader,
    options: PosthogTelemetryReaderOptions = {}
  ) {
    this.reader = reader;
    this.eventPrefix = options.eventPrefix ?? 'observability';
  }

  async readOperationSamples(
    input: ReadOperationSamplesInput
  ): Promise<OperationMetricSample[]> {
    const result = await this.queryHogQL({
      query: [
        'select',
        '  properties.operation as operationKey,',
        '  properties.version as version,',
        '  properties.durationMs as durationMs,',
        '  properties.success as success,',
        '  properties.errorCode as errorCode,',
        '  properties.tenantId as tenantId,',
        '  properties.traceId as traceId,',
        '  properties.metadata as metadata,',
        '  timestamp as timestamp',
        'from events',
        `where ${buildOperationWhereClause(this.eventPrefix, input)}`,
        'order by timestamp desc',
        `limit ${input.limit ?? 1000}`,
      ].join('\n'),
      values: buildOperationValues(input),
    });

    return mapOperationSamples(result);
  }

  async readAnomalyBaseline(
    operation: OperationCoordinate,
    windowDays = 7
  ): Promise<SpecUsageStats | null> {
    const dateRange = buildWindowRange(windowDays);
    const baseResult = await this.queryHogQL({
      query: [
        'select',
        '  count() as totalCalls,',
        '  avg(properties.durationMs) as averageLatencyMs,',
        '  quantile(0.95)(properties.durationMs) as p95LatencyMs,',
        '  quantile(0.99)(properties.durationMs) as p99LatencyMs,',
        '  max(properties.durationMs) as maxLatencyMs,',
        '  sum(if(properties.success = 1, 1, 0)) as successCount,',
        '  sum(if(properties.success = 0, 1, 0)) as errorCount',
        'from events',
        `where ${buildOperationWhereClause(this.eventPrefix, {
          operations: [operation],
          dateRange,
        })}`,
      ].join('\n'),
      values: buildOperationValues({
        operations: [operation],
        dateRange,
      }),
    });

    const stats = mapBaselineStats(baseResult, operation, dateRange);
    if (!stats) return null;

    const topErrors = await this.readTopErrors(operation, dateRange);
    return {
      ...stats,
      topErrors,
    };
  }

  private async readTopErrors(
    operation: OperationCoordinate,
    dateRange: DateRangeInput
  ): Promise<Record<string, number>> {
    const result = await this.queryHogQL({
      query: [
        'select',
        '  properties.errorCode as errorCode,',
        '  count() as errorCount',
        'from events',
        `where ${buildOperationWhereClause(this.eventPrefix, {
          operations: [operation],
          dateRange,
        })} and properties.success = 0`,
        'group by errorCode',
        'order by errorCount desc',
        'limit 5',
      ].join('\n'),
      values: buildOperationValues({
        operations: [operation],
        dateRange,
      }),
    });

    const rows = mapRows(result);
    return rows.reduce<Record<string, number>>((acc, row) => {
      const code = asString(row.errorCode);
      if (!code) return acc;
      acc[code] = asNumber(row.errorCount);
      return acc;
    }, {});
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

function buildOperationWhereClause(
  eventPrefix: string,
  input: { operations?: OperationCoordinate[]; dateRange?: DateRangeInput }
): string {
  const clauses = [`event = '${eventPrefix}.operation'`];
  if (input.operations?.length) {
    clauses.push(`(${buildOperationFilters(input.operations)})`);
  }
  if (input.dateRange?.from) {
    clauses.push('timestamp >= {dateFrom}');
  }
  if (input.dateRange?.to) {
    clauses.push('timestamp < {dateTo}');
  }
  return clauses.join(' and ');
}

function buildOperationValues(input: {
  operations?: OperationCoordinate[];
  dateRange?: DateRangeInput;
}): Record<string, unknown> {
  const values: Record<string, unknown> = {
    dateFrom: toIsoString(input.dateRange?.from),
    dateTo: toIsoString(input.dateRange?.to),
  };
  input.operations?.forEach((op, index) => {
    values[`operationKey${index}`] = op.key;
    values[`operationVersion${index}`] = op.version;
    if (op.tenantId) {
      values[`operationTenant${index}`] = op.tenantId;
    }
  });
  return values;
}

function buildOperationFilters(operations: OperationCoordinate[]): string {
  return operations
    .map((op, index) => {
      const clauses = [
        `properties.operation = {operationKey${index}}`,
        `properties.version = {operationVersion${index}}`,
      ];
      if (op.tenantId) {
        clauses.push(`properties.tenantId = {operationTenant${index}}`);
      }
      return `(${clauses.join(' and ')})`;
    })
    .join(' or ');
}

function mapOperationSamples(
  result: AnalyticsQueryResult
): OperationMetricSample[] {
  const rows = mapRows(result);
  return rows.flatMap((row) => {
    const operationKey = asString(row.operationKey);
    const version = asString(row.version);
    const timestamp = asDate(row.timestamp);
    if (!operationKey || !version || !timestamp) {
      return [];
    }
    return [
      {
        operation: {
          key: operationKey,
          version,
          tenantId: asOptionalString(row.tenantId) ?? undefined,
        },
        durationMs: asNumber(row.durationMs),
        success: asBoolean(row.success),
        timestamp,
        errorCode: asOptionalString(row.errorCode) ?? undefined,
        traceId: asOptionalString(row.traceId) ?? undefined,
        metadata: isRecord(row.metadata) ? row.metadata : undefined,
      },
    ];
  });
}

function mapBaselineStats(
  result: AnalyticsQueryResult,
  operation: OperationCoordinate,
  dateRange: DateRangeInput
): SpecUsageStats | null {
  const rows = mapRows(result);
  const row = rows[0];
  if (!row) return null;
  const totalCalls = asNumber(row.totalCalls);
  if (!totalCalls) return null;
  const successCount = asNumber(row.successCount);
  const errorCount = asNumber(row.errorCount);
  return {
    operation,
    totalCalls,
    successRate: totalCalls ? successCount / totalCalls : 0,
    errorRate: totalCalls ? errorCount / totalCalls : 0,
    averageLatencyMs: asNumber(row.averageLatencyMs),
    p95LatencyMs: asNumber(row.p95LatencyMs),
    p99LatencyMs: asNumber(row.p99LatencyMs),
    maxLatencyMs: asNumber(row.maxLatencyMs),
    lastSeenAt: new Date(),
    windowStart: toDate(dateRange.from) ?? new Date(),
    windowEnd: toDate(dateRange.to) ?? new Date(),
    topErrors: {},
  };
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

function buildWindowRange(windowDays: number): DateRangeInput {
  const windowEnd = new Date();
  const windowStart = new Date(
    windowEnd.getTime() - windowDays * 24 * 60 * 60 * 1000
  );
  return {
    from: windowStart,
    to: windowEnd,
  };
}

function asString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);
  return null;
}

function asOptionalString(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return null;
}

function asNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
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

function toDate(value?: string | Date): Date | null {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

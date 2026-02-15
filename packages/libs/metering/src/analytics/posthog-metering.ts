import type { AnalyticsProvider } from '@contractspec/lib.contracts-integrations';

export interface MeteringUsageRecord {
  recordId?: string;
  metricKey: string;
  subjectType: string;
  subjectId: string;
  quantity: number;
  source?: string;
  timestamp: Date;
}

export interface MeteringUsageAggregate {
  summaryId?: string;
  metricKey: string;
  subjectType: string;
  subjectId: string;
  periodType: string;
  periodStart: Date;
  periodEnd: Date;
  totalQuantity: number;
  recordCount: number;
  aggregatedAt: Date;
}

export interface PosthogMeteringReporterOptions {
  eventPrefix?: string;
  includeSource?: boolean;
}

export class PosthogMeteringReporter {
  private readonly provider: AnalyticsProvider;
  private readonly eventPrefix: string;
  private readonly includeSource: boolean;

  constructor(
    provider: AnalyticsProvider,
    options: PosthogMeteringReporterOptions = {}
  ) {
    this.provider = provider;
    this.eventPrefix = options.eventPrefix ?? 'metering';
    this.includeSource = options.includeSource ?? true;
  }

  async captureUsageRecorded(record: MeteringUsageRecord): Promise<void> {
    await this.provider.capture({
      distinctId: record.subjectId,
      event: `${this.eventPrefix}.usage_recorded`,
      timestamp: record.timestamp,
      properties: {
        recordId: record.recordId ?? null,
        metricKey: record.metricKey,
        subjectType: record.subjectType,
        quantity: record.quantity,
        ...(this.includeSource && record.source
          ? { source: record.source }
          : {}),
      },
    });
  }

  async captureUsageAggregated(summary: MeteringUsageAggregate): Promise<void> {
    await this.provider.capture({
      distinctId: summary.subjectId,
      event: `${this.eventPrefix}.usage_aggregated`,
      timestamp: summary.aggregatedAt,
      properties: {
        summaryId: summary.summaryId ?? null,
        metricKey: summary.metricKey,
        subjectType: summary.subjectType,
        periodType: summary.periodType,
        periodStart: summary.periodStart.toISOString(),
        periodEnd: summary.periodEnd.toISOString(),
        totalQuantity: summary.totalQuantity,
        recordCount: summary.recordCount,
      },
    });
  }
}

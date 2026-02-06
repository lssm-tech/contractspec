import type { AnalyticsProvider } from '@contractspec/lib.contracts/integrations/providers/analytics';
import type {
  IntentAggregatorSnapshot,
  TelemetrySample,
} from '../intent/aggregator';

export interface PosthogTelemetryProviderOptions {
  eventPrefix?: string;
  includeMetadata?: boolean;
}

export class PosthogTelemetryProvider {
  private readonly provider: AnalyticsProvider;
  private readonly eventPrefix: string;
  private readonly includeMetadata: boolean;

  constructor(
    provider: AnalyticsProvider,
    options: PosthogTelemetryProviderOptions = {}
  ) {
    this.provider = provider;
    this.eventPrefix = options.eventPrefix ?? 'observability';
    this.includeMetadata = options.includeMetadata ?? false;
  }

  async captureSample(sample: TelemetrySample): Promise<void> {
    await this.provider.capture({
      distinctId: sample.actorId ?? sample.tenantId ?? 'unknown',
      event: `${this.eventPrefix}.operation`,
      timestamp: sample.timestamp,
      properties: {
        operation: sample.operation.name,
        version: sample.operation.version,
        durationMs: sample.durationMs,
        success: sample.success,
        errorCode: sample.errorCode ?? null,
        tenantId: sample.tenantId ?? null,
        traceId: sample.traceId ?? null,
        ...(this.includeMetadata && sample.metadata
          ? { metadata: sample.metadata }
          : {}),
      },
    });
  }

  async captureSnapshot(snapshot: IntentAggregatorSnapshot): Promise<void> {
    await this.provider.capture({
      distinctId: 'system',
      event: `${this.eventPrefix}.window`,
      timestamp: snapshot.windowEnd ?? new Date(),
      properties: {
        sampleCount: snapshot.sampleCount,
        metricsCount: snapshot.metrics.length,
        sequencesCount: snapshot.sequences.length,
        windowStart: snapshot.windowStart?.toISOString() ?? null,
        windowEnd: snapshot.windowEnd?.toISOString() ?? null,
        ...(this.includeMetadata
          ? {
              metrics: snapshot.metrics.map((metric) => ({
                operation: metric.operation.name,
                version: metric.operation.version,
                totalCalls: metric.totalCalls,
                successRate: metric.successRate,
                errorRate: metric.errorRate,
                averageLatencyMs: metric.averageLatencyMs,
                p95LatencyMs: metric.p95LatencyMs,
                p99LatencyMs: metric.p99LatencyMs,
                maxLatencyMs: metric.maxLatencyMs,
                topErrors: metric.topErrors,
              })),
              sequences: snapshot.sequences,
            }
          : {}),
      },
    });
  }
}

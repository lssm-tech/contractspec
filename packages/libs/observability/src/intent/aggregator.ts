export interface TelemetrySample {
  operation: { name: string; version: number };
  durationMs: number;
  success: boolean;
  timestamp: Date;
  errorCode?: string;
  tenantId?: string;
  traceId?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

export interface AggregatedOperationMetrics {
  operation: { name: string; version: number };
  totalCalls: number;
  successRate: number;
  errorRate: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  maxLatencyMs: number;
  windowStart: Date;
  windowEnd: Date;
  topErrors: Record<string, number>;
}

export interface OperationSequence {
  steps: string[];
  tenantId?: string;
  count: number;
}

export interface IntentAggregatorSnapshot {
  metrics: AggregatedOperationMetrics[];
  sequences: OperationSequence[];
  sampleCount: number;
  windowStart?: Date;
  windowEnd?: Date;
}

export interface IntentAggregatorOptions {
  windowMs?: number;
  sequenceSampleSize?: number;
}

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export class IntentAggregator {
  private readonly windowMs: number;
  private readonly sequenceSampleSize: number;
  private readonly samples: TelemetrySample[] = [];

  constructor(options: IntentAggregatorOptions = {}) {
    this.windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
    this.sequenceSampleSize = options.sequenceSampleSize ?? 1000;
  }

  add(sample: TelemetrySample) {
    this.samples.push(sample);
  }

  flush(now = new Date()): IntentAggregatorSnapshot {
    const minTimestamp = now.getTime() - this.windowMs;
    const windowSamples = this.samples.filter(
      (sample) => sample.timestamp.getTime() >= minTimestamp
    );
    this.samples.length = 0;
    const metrics = this.aggregateMetrics(windowSamples);
    const sequences = this.buildSequences(windowSamples);
    const timestamps = windowSamples.map((sample) =>
      sample.timestamp.getTime()
    );
    return {
      metrics,
      sequences,
      sampleCount: windowSamples.length,
      windowStart: timestamps.length
        ? new Date(Math.min(...timestamps))
        : undefined,
      windowEnd: timestamps.length
        ? new Date(Math.max(...timestamps))
        : undefined,
    };
  }

  private aggregateMetrics(samples: TelemetrySample[]) {
    if (!samples.length) return [] as AggregatedOperationMetrics[];
    const groups = new Map<string, TelemetrySample[]>();
    for (const sample of samples) {
      const key = `${sample.operation.name}.v${sample.operation.version}`;
      const arr = groups.get(key) ?? [];
      arr.push(sample);
      groups.set(key, arr);
    }

    return [...groups.values()].map((group) => {
      const durations = group.map((s) => s.durationMs).sort((a, b) => a - b);
      const errors = group.filter((s) => !s.success);
      const totalCalls = group.length;
      const topErrors = errors.reduce<Record<string, number>>((acc, sample) => {
        if (!sample.errorCode) return acc;
        acc[sample.errorCode] = (acc[sample.errorCode] ?? 0) + 1;
        return acc;
      }, {});
      const timestamps = group.map((s) => s.timestamp.getTime());
      return {
        operation: group[0]!.operation,
        totalCalls,
        successRate: (totalCalls - errors.length) / totalCalls,
        errorRate: errors.length / totalCalls,
        averageLatencyMs:
          durations.reduce((sum, value) => sum + value, 0) / totalCalls,
        p95LatencyMs: percentile(durations, 0.95),
        p99LatencyMs: percentile(durations, 0.99),
        maxLatencyMs: Math.max(...durations),
        windowStart: new Date(Math.min(...timestamps)),
        windowEnd: new Date(Math.max(...timestamps)),
        topErrors,
      } satisfies AggregatedOperationMetrics;
    });
  }

  private buildSequences(samples: TelemetrySample[]): OperationSequence[] {
    const byTrace = new Map<string, TelemetrySample[]>();
    for (const sample of samples.slice(-this.sequenceSampleSize)) {
      if (!sample.traceId) continue;
      const arr = byTrace.get(sample.traceId) ?? [];
      arr.push(sample);
      byTrace.set(sample.traceId, arr);
    }

    const sequences: Record<string, OperationSequence> = {};
    for (const [traceId, events] of byTrace.entries()) {
      const ordered = events.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );
      const steps = ordered.map((event) => event.operation.name);
      if (steps.length < 2) continue;
      const key = `${steps.join('>')}@${ordered[0]?.tenantId ?? 'global'}`;
      const existing = sequences[key];
      if (existing) {
        existing.count += 1;
      } else {
        sequences[key] = {
          steps,
          tenantId: ordered[0]?.tenantId,
          count: 1,
        };
      }
    }

    return Object.values(sequences).sort((a, b) => b.count - a.count);
  }
}

function percentile(values: number[], ratio: number) {
  if (!values.length) return 0;
  if (values.length === 1) return values[0]!;
  const index = Math.min(values.length - 1, Math.floor(ratio * values.length));
  return values[index]!;
}



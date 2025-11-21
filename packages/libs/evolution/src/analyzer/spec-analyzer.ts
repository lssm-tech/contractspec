import { Logger } from '@lssm/lib.observability';
import { randomUUID } from 'node:crypto';
import type { LifecycleStage } from '@lssm/lib.lifecycle';
import {
  type IntentPattern,
  type OperationCoordinate,
  type OperationMetricSample,
  type OptimizationHint,
  type PatternConfidence,
  type SpecAnomaly,
  type SpecUsageStats,
  type SuggestionEvidence,
} from '../types';

export interface SpecAnalyzerOptions {
  logger?: Logger;
  minSampleSize?: number;
  errorRateThreshold?: number;
  latencyP99ThresholdMs?: number;
  throughputDropThreshold?: number;
}

const DEFAULT_OPTIONS: Required<
  Pick<
    SpecAnalyzerOptions,
    'minSampleSize' | 'errorRateThreshold' | 'latencyP99ThresholdMs'
  >
> = {
  minSampleSize: 50,
  errorRateThreshold: 0.05,
  latencyP99ThresholdMs: 750,
};

export class SpecAnalyzer {
  private readonly logger?: Logger;
  private readonly minSampleSize: number;
  private readonly errorRateThreshold: number;
  private readonly latencyP99ThresholdMs: number;
  private readonly throughputDropThreshold: number;

  constructor(options: SpecAnalyzerOptions = {}) {
    this.logger = options.logger;
    this.minSampleSize = options.minSampleSize ?? DEFAULT_OPTIONS.minSampleSize;
    this.errorRateThreshold =
      options.errorRateThreshold ?? DEFAULT_OPTIONS.errorRateThreshold;
    this.latencyP99ThresholdMs =
      options.latencyP99ThresholdMs ?? DEFAULT_OPTIONS.latencyP99ThresholdMs;
    this.throughputDropThreshold = options.throughputDropThreshold ?? 0.2;
  }

  analyzeSpecUsage(samples: OperationMetricSample[]): SpecUsageStats[] {
    if (!samples.length) {
      this.logger?.debug('SpecAnalyzer.analyzeSpecUsage.skip', {
        reason: 'no-samples',
      });
      return [];
    }

    const groups = new Map<string, OperationMetricSample[]>();
    for (const sample of samples) {
      const key = this.operationKey(sample);
      const arr = groups.get(key) ?? [];
      arr.push(sample);
      groups.set(key, arr);
    }

    const entries = [...groups.values()];
    const usable = entries.filter((samplesForOp) => {
      const valid = samplesForOp.length >= this.minSampleSize;
      if (!valid) {
        this.logger?.debug('SpecAnalyzer.analyzeSpecUsage.skipOperation', {
          operation: this.operationKey(samplesForOp[0]!),
          sampleSize: samplesForOp.length,
          minSampleSize: this.minSampleSize,
        });
      }
      return valid;
    });

    return usable.map((operationSamples) =>
      this.buildUsageStats(operationSamples)
    );
  }

  detectAnomalies(
    stats: SpecUsageStats[],
    baseline?: SpecUsageStats[]
  ): SpecAnomaly[] {
    const anomalies: SpecAnomaly[] = [];
    if (!stats.length) {
      this.logger?.debug('SpecAnalyzer.detectAnomalies.skip', {
        reason: 'no-stats',
      });
      return anomalies;
    }
    const baselineByOp = new Map(
      (baseline ?? []).map((item) => [this.operationKey(item.operation), item])
    );

    for (const stat of stats) {
      const evidence: SuggestionEvidence[] = [];

      if (stat.errorRate >= this.errorRateThreshold) {
        evidence.push({
          type: 'telemetry',
          description: `Error rate ${stat.errorRate.toFixed(2)} exceeded threshold ${this.errorRateThreshold}`,
          data: { errorRate: stat.errorRate },
        });
        anomalies.push({
          operation: stat.operation,
          severity: this.toSeverity(stat.errorRate / this.errorRateThreshold),
          metric: 'error-rate',
          description: 'Error rate spike',
          detectedAt: new Date(),
          threshold: this.errorRateThreshold,
          observedValue: stat.errorRate,
          evidence,
        });
        continue;
      }

      if (stat.p99LatencyMs >= this.latencyP99ThresholdMs) {
        evidence.push({
          type: 'telemetry',
          description: `P99 latency ${stat.p99LatencyMs}ms exceeded threshold ${this.latencyP99ThresholdMs}ms`,
          data: { p99LatencyMs: stat.p99LatencyMs },
        });
        anomalies.push({
          operation: stat.operation,
          severity: this.toSeverity(
            stat.p99LatencyMs / this.latencyP99ThresholdMs
          ),
          metric: 'latency',
          description: 'Latency regression detected',
          detectedAt: new Date(),
          threshold: this.latencyP99ThresholdMs,
          observedValue: stat.p99LatencyMs,
          evidence,
        });
        continue;
      }

      const baselineStat = baselineByOp.get(this.operationKey(stat.operation));
      if (baselineStat) {
        const drop =
          (baselineStat.totalCalls - stat.totalCalls) / baselineStat.totalCalls;
        if (drop >= this.throughputDropThreshold) {
          evidence.push({
            type: 'telemetry',
            description: `Throughput dropped by ${(drop * 100).toFixed(1)}% compared to baseline`,
            data: {
              baselineCalls: baselineStat.totalCalls,
              currentCalls: stat.totalCalls,
            },
          });
          anomalies.push({
            operation: stat.operation,
            severity: this.toSeverity(drop / this.throughputDropThreshold),
            metric: 'throughput',
            description: 'Usage drop detected',
            detectedAt: new Date(),
            threshold: this.throughputDropThreshold,
            observedValue: drop,
            evidence,
          });
        }
      }
    }

    return anomalies;
  }

  toIntentPatterns(
    anomalies: SpecAnomaly[],
    stats: SpecUsageStats[]
  ): IntentPattern[] {
    const statsByOp = new Map(
      stats.map((item) => [this.operationKey(item.operation), item])
    );
    return anomalies.map((anomaly) => {
      const stat = statsByOp.get(this.operationKey(anomaly.operation));
      const confidence: PatternConfidence = {
        score: Math.min(
          1,
          (anomaly.observedValue ?? 0) / (anomaly.threshold ?? 1)
        ),
        sampleSize: stat?.totalCalls ?? 0,
        pValue: undefined,
      };
      return {
        id: randomUUID(),
        type: this.mapMetricToIntent(anomaly.metric),
        description: anomaly.description,
        operation: anomaly.operation,
        confidence,
        metadata: {
          observedValue: anomaly.observedValue,
          threshold: anomaly.threshold,
        },
        evidence: anomaly.evidence,
      };
    });
  }

  suggestOptimizations(
    stats: SpecUsageStats[],
    anomalies: SpecAnomaly[],
    lifecycleContext?: { stage: LifecycleStage }
  ): OptimizationHint[] {
    const anomaliesByOp = new Map<string, SpecAnomaly[]>(
      this.groupByOperation(anomalies)
    );
    const hints: OptimizationHint[] = [];

    for (const stat of stats) {
      const opKey = this.operationKey(stat.operation);
      const opAnomalies = anomaliesByOp.get(opKey) ?? [];
      for (const anomaly of opAnomalies) {
        if (anomaly.metric === 'latency') {
          hints.push(
            this.applyLifecycleContext(
              {
                operation: stat.operation,
                category: 'performance',
                summary: 'Latency regression detected',
                justification: `P99 latency at ${stat.p99LatencyMs}ms`,
                recommendedActions: [
                  'Add batching or caching layer',
                  'Replay golden tests to capture slow inputs',
                ],
              },
              lifecycleContext?.stage
            )
          );
        } else if (anomaly.metric === 'error-rate') {
          const topError = Object.entries(stat.topErrors).sort(
            (a, b) => b[1] - a[1]
          )[0]?.[0];
          hints.push(
            this.applyLifecycleContext(
              {
                operation: stat.operation,
                category: 'error-handling',
                summary: 'Error spike detected',
                justification: topError
                  ? `Dominant error code ${topError}`
                  : 'Increase in failures',
                recommendedActions: [
                  'Generate regression spec from failing payloads',
                  'Add policy guardrails before rollout',
                ],
              },
              lifecycleContext?.stage
            )
          );
        } else if (anomaly.metric === 'throughput') {
          hints.push(
            this.applyLifecycleContext(
              {
            operation: stat.operation,
            category: 'performance',
                summary: 'Throughput drop detected',
                justification: 'Significant traffic reduction relative to baseline',
            recommendedActions: [
                  'Validate routing + feature flag bucketing',
                  'Backfill spec variant to rehydrate demand',
            ],
              },
              lifecycleContext?.stage
            )
          );
        }
      }
    }
    return hints;
  }

  private operationKey(
    op:
      | OperationCoordinate
      | SpecUsageStats
      | SpecAnomaly
      | OperationMetricSample
  ) {
    const coordinate =
      'operation' in op ? (op.operation as OperationCoordinate) : op;
    return `${coordinate.name}.v${coordinate.version}${
      coordinate.tenantId ? `@${coordinate.tenantId}` : ''
    }`;
  }

  private buildUsageStats(samples: OperationMetricSample[]): SpecUsageStats {
    const durations = samples.map((s) => s.durationMs).sort((a, b) => a - b);
    const errors = samples.filter((s) => !s.success);
    const totalCalls = samples.length;
    const successRate = (totalCalls - errors.length) / totalCalls;
    const errorRate = errors.length / totalCalls;
    const averageLatencyMs =
      durations.reduce((sum, value) => sum + value, 0) / totalCalls;

    const topErrors = errors.reduce<Record<string, number>>((acc, sample) => {
      if (!sample.errorCode) return acc;
      acc[sample.errorCode] = (acc[sample.errorCode] ?? 0) + 1;
      return acc;
    }, {});

    const timestamps = samples.map((s) => s.timestamp.getTime());
    const windowStart = new Date(Math.min(...timestamps));
    const windowEnd = new Date(Math.max(...timestamps));

    return {
      operation: samples[0]!.operation,
      totalCalls,
      successRate,
      errorRate,
      averageLatencyMs,
      p95LatencyMs: percentile(durations, 0.95),
      p99LatencyMs: percentile(durations, 0.99),
      maxLatencyMs: Math.max(...durations),
      lastSeenAt: windowEnd,
      windowStart,
      windowEnd,
      topErrors,
    };
  }

  private toSeverity(ratio: number): SpecAnomaly['severity'] {
    if (ratio >= 2) return 'high';
    if (ratio >= 1.3) return 'medium';
    return 'low';
  }

  private mapMetricToIntent(
    metric: SpecAnomaly['metric']
  ): IntentPattern['type'] {
    switch (metric) {
      case 'error-rate':
        return 'error-spike';
      case 'latency':
        return 'latency-regression';
      case 'throughput':
        return 'throughput-drop';
      default:
        return 'schema-mismatch';
    }
  }

  private groupByOperation<T extends { operation: OperationCoordinate }>(
    items: T[]
  ): Map<string, T[]> {
    const map = new Map<string, T[]>();
    for (const item of items) {
      const key = this.operationKey(item.operation);
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    }
    return map;
  }

  private applyLifecycleContext(
    hint: OptimizationHint,
    stage?: LifecycleStage
  ): OptimizationHint {
    if (stage === undefined) return hint;
    const band = mapStageBand(stage);
    const advice = LIFECYCLE_HINTS[band]?.[hint.category];
    if (!advice) {
      return { ...hint, lifecycleStage: stage };
    }
    return {
      ...hint,
      lifecycleStage: stage,
      lifecycleNotes: advice.message,
      recommendedActions: dedupeActions([
        ...hint.recommendedActions,
        ...advice.supplementalActions,
      ]),
    };
  }
}

function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  if (values.length === 1) return values[0]!;
  const idx = Math.min(values.length - 1, Math.floor(p * values.length));
  return values[idx]!;
}

type StageBand = 'early' | 'pmf' | 'scale' | 'mature';

const mapStageBand = (stage: LifecycleStage): StageBand => {
  if (stage <= 2) return 'early';
  if (stage === LifecycleStage.ProductMarketFit) return 'pmf';
  if (stage === LifecycleStage.GrowthScaleUp || stage === LifecycleStage.ExpansionPlatform) {
    return 'scale';
  }
  return 'mature';
};

const LIFECYCLE_HINTS: Record<
  StageBand,
  Partial<
    Record<
      OptimizationHint['category'],
      { message: string; supplementalActions: string[] }
    >
  >
> = {
  early: {
    performance: {
      message: 'Favor guardrails that protect learning velocity before heavy rewrites.',
      supplementalActions: ['Wrap risky changes behind progressive delivery flags'],
    },
    'error-handling': {
      message: 'Make failures loud and recoverable so you can learn faster.',
      supplementalActions: ['Add auto-rollbacks or manual kill switches'],
    },
  },
  pmf: {
    performance: {
      message: 'Stabilize the core use case to avoid regressions while demand grows.',
      supplementalActions: ['Instrument regression tests on critical specs'],
    },
  },
  scale: {
    performance: {
      message: 'Prioritize resilience and multi-tenant safety as volumes expand.',
      supplementalActions: ['Introduce workload partitioning or isolation per tenant'],
    },
    'error-handling': {
      message: 'Contain blast radius with policy fallbacks and circuit breakers.',
      supplementalActions: ['Add circuit breakers to high-risk operations'],
    },
  },
  mature: {
    performance: {
      message: 'Optimize for margins and predictable SLAs.',
      supplementalActions: ['Capture unit-cost impacts alongside latency fixes'],
    },
    'error-handling': {
      message: 'Prevent regressions with automated regression specs before deploy.',
      supplementalActions: ['Run auto-evolution simulations on renewal scenarios'],
    },
  },
};

const dedupeActions = (actions: string[]): string[] => {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const action of actions) {
    if (seen.has(action)) continue;
    seen.add(action);
    ordered.push(action);
  }
  return ordered;
};


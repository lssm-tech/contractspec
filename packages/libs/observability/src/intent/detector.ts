import { randomUUID } from 'node:crypto';
import type {
  AggregatedOperationMetrics,
  OperationSequence,
} from './aggregator';

export type IntentSignalType =
  | 'latency-regression'
  | 'error-spike'
  | 'throughput-drop'
  | 'missing-workflow-step';

export interface IntentSignal {
  id: string;
  type: IntentSignalType;
  operation?: AggregatedOperationMetrics['operation'];
  confidence: number;
  description: string;
  metadata?: Record<string, unknown>;
  evidence: Array<{
    type: 'metric' | 'sequence' | 'anomaly';
    description: string;
    data?: Record<string, unknown>;
  }>;
}

export interface IntentDetectorOptions {
  errorRateThreshold?: number;
  latencyP99ThresholdMs?: number;
  throughputDropThreshold?: number;
  minSequenceLength?: number;
}

const DEFAULTS = {
  errorRateThreshold: 0.05,
  latencyP99ThresholdMs: 750,
  throughputDropThreshold: 0.3,
  minSequenceLength: 3,
};

export class IntentDetector {
  private readonly options: Required<IntentDetectorOptions>;

  constructor(options: IntentDetectorOptions = {}) {
    this.options = {
      errorRateThreshold:
        options.errorRateThreshold ?? DEFAULTS.errorRateThreshold,
      latencyP99ThresholdMs:
        options.latencyP99ThresholdMs ?? DEFAULTS.latencyP99ThresholdMs,
      throughputDropThreshold:
        options.throughputDropThreshold ?? DEFAULTS.throughputDropThreshold,
      minSequenceLength:
        options.minSequenceLength ?? DEFAULTS.minSequenceLength,
    };
  }

  detectFromMetrics(
    current: AggregatedOperationMetrics[],
    previous?: AggregatedOperationMetrics[]
  ): IntentSignal[] {
    const signals: IntentSignal[] = [];
    const baseline = new Map(
      (previous ?? []).map((metric) => [
        `${metric.operation.name}.v${metric.operation.version}`,
        metric,
      ])
    );

    for (const metric of current) {
      if (metric.errorRate >= this.options.errorRateThreshold) {
        signals.push({
          id: randomUUID(),
          type: 'error-spike',
          operation: metric.operation,
          confidence: Math.min(
            1,
            metric.errorRate / this.options.errorRateThreshold
          ),
          description: `Error rate ${metric.errorRate.toFixed(2)} exceeded threshold`,
          metadata: {
            errorRate: metric.errorRate,
            topErrors: metric.topErrors,
          },
          evidence: [
            {
              type: 'metric',
              description: 'error-rate',
              data: {
                errorRate: metric.errorRate,
                threshold: this.options.errorRateThreshold,
              },
            },
          ],
        });
        continue;
      }

      if (metric.p99LatencyMs >= this.options.latencyP99ThresholdMs) {
        signals.push({
          id: randomUUID(),
          type: 'latency-regression',
          operation: metric.operation,
          confidence: Math.min(
            1,
            metric.p99LatencyMs / this.options.latencyP99ThresholdMs
          ),
          description: `P99 latency ${metric.p99LatencyMs}ms exceeded threshold`,
          metadata: { p99LatencyMs: metric.p99LatencyMs },
          evidence: [
            {
              type: 'metric',
              description: 'p99-latency',
              data: {
                p99LatencyMs: metric.p99LatencyMs,
                threshold: this.options.latencyP99ThresholdMs,
              },
            },
          ],
        });
        continue;
      }

      const base = baseline.get(
        `${metric.operation.name}.v${metric.operation.version}`
      );
      if (base) {
        const drop =
          (base.totalCalls - metric.totalCalls) / Math.max(base.totalCalls, 1);
        if (drop >= this.options.throughputDropThreshold) {
          signals.push({
            id: randomUUID(),
            type: 'throughput-drop',
            operation: metric.operation,
            confidence: Math.min(
              1,
              drop / this.options.throughputDropThreshold
            ),
            description: `Throughput dropped ${(drop * 100).toFixed(1)}% vs baseline`,
            metadata: {
              baselineCalls: base.totalCalls,
              currentCalls: metric.totalCalls,
            },
            evidence: [
              {
                type: 'metric',
                description: 'throughput-drop',
                data: {
                  baselineCalls: base.totalCalls,
                  currentCalls: metric.totalCalls,
                },
              },
            ],
          });
        }
      }
    }

    return signals;
  }

  detectSequentialIntents(sequences: OperationSequence[]): IntentSignal[] {
    const signals: IntentSignal[] = [];
    for (const sequence of sequences) {
      if (sequence.steps.length < this.options.minSequenceLength) continue;
      const description = sequence.steps.join(' → ');
      signals.push({
        id: randomUUID(),
        type: 'missing-workflow-step',
        confidence: 0.6,
        description: `Repeated workflow detected: ${description}`,
        metadata: {
          steps: sequence.steps,
          tenantId: sequence.tenantId,
          occurrences: sequence.count,
        },
        evidence: [
          {
            type: 'sequence',
            description: 'sequential-calls',
            data: { steps: sequence.steps, count: sequence.count },
          },
        ],
      });
    }
    return signals;
  }
}



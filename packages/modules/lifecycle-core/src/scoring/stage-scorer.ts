import type {
  LifecycleMetricSnapshot,
  LifecycleScore,
  LifecycleSignal,
} from '@lssm/lib.lifecycle';
import { LIFECYCLE_STAGE_META, LifecycleStage } from '@lssm/lib.lifecycle';
import stageWeights from '../data/stage-weights.json' assert { type: 'json' };

type MetricKey = keyof LifecycleMetricSnapshot;

interface MetricWeightConfig {
  weight: number;
  threshold: number;
  direction?: 'gte' | 'lte';
}

interface StageWeightConfig {
  base: number;
  metrics?: Record<MetricKey, MetricWeightConfig>;
  signalKinds?: Partial<Record<string, number>>;
}

type StageWeights = Record<string, StageWeightConfig>;

const DEFAULT_WEIGHTS = stageWeights as StageWeights;

export interface StageScoreInput {
  metrics: LifecycleMetricSnapshot;
  signals: LifecycleSignal[];
}

export class StageScorer {
  private readonly weights: StageWeights;

  constructor(weights: StageWeights = DEFAULT_WEIGHTS) {
    this.weights = weights;
  }

  score(input: StageScoreInput): LifecycleScore[] {
    const kindStrength = evaluateSignalKinds(input.signals);

    const scores = Object.values(LifecycleStage)
      .filter(isStageValue)
      .map((stage) => {
        const stageName = LifecycleStage[stage];
        const config = this.weights[stageName] ?? { base: 0.5 };
        let score = config.base ?? 0.5;
        let contributions = 0;
        const totalPossible =
          Object.keys(config.metrics ?? {}).length +
            Object.keys(config.signalKinds ?? {}).length || 1;
        const supportingSignals: string[] = [];

        if (config.metrics) {
          Object.entries(config.metrics).forEach(
            ([metricKey, metricConfig]) => {
              const value = input.metrics[metricKey as MetricKey];
              if (value === undefined || value === null) return;
              if (passesThreshold(value as number, metricConfig)) {
                score += metricConfig.weight;
                contributions += 1;
                supportingSignals.push(`metric:${metricKey}`);
              } else {
                score += metricConfig.weight * 0.25;
              }
            }
          );
        }

        if (config.signalKinds) {
          Object.entries(config.signalKinds).forEach(([kind, weight]) => {
            const strength = kindStrength[kind] ?? 0;
            if (strength > 0) {
              score += weight;
              contributions += 1;
              supportingSignals.push(`signal:${kind}`);
            }
          });
        }

        score = clamp(score, 0, 1.25); // allow slight overage before clamp
        const confidence = clamp(contributions / totalPossible, 0.1, 1);

        return {
          stage,
          score,
          confidence,
          supportingSignals,
        };
      });

    return scores.sort((a, b) => {
      if (b.score === a.score) {
        return b.confidence - a.confidence;
      }
      return b.score - a.score;
    });
  }
}

const passesThreshold = (
  value: number,
  config: MetricWeightConfig
): boolean => {
  const direction = config.direction ?? 'gte';
  if (direction === 'gte') {
    return value >= config.threshold;
  }
  return value <= config.threshold;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const evaluateSignalKinds = (
  signals: LifecycleSignal[]
): Record<string, number> =>
  signals.reduce<Record<string, number>>((acc, signal) => {
    const key = signal.kind ?? 'unknown';
    acc[key] = (acc[key] ?? 0) + (signal.weight ?? 1);
    return acc;
  }, {});

const isStageValue = (
  value: string | LifecycleStage
): value is LifecycleStage =>
  typeof value === 'number' && value in LIFECYCLE_STAGE_META;

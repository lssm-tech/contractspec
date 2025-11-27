import { createHash } from 'node:crypto';
import type {
  ExperimentAssignment,
  ExperimentDefinition,
  ExperimentVariant,
} from '../types';

export interface ExperimentRunnerOptions {
  salt?: string;
}

export class ExperimentRunner {
  private readonly salt: string;

  constructor(options?: ExperimentRunnerOptions) {
    this.salt = options?.salt ?? 'growth.runner';
  }

  assign(
    experiment: ExperimentDefinition,
    userId: string,
    context?: Record<string, string>
  ): ExperimentAssignment {
    const variant =
      this.pickVariant(experiment.variants, experiment.key, userId) ??
      experiment.variants[0];
    if (!variant) {
      throw new Error(`Experiment ${experiment.key} has no variants`);
    }
    return {
      experimentKey: `${experiment.key}.v${experiment.version}`,
      variantId: variant.id,
      userId,
      assignedAt: new Date(),
      context,
    };
  }

  private pickVariant(
    variants: ExperimentVariant[],
    experimentKey: string,
    userId: string
  ) {
    const weights = normalizeWeights(variants);
    const bucket = this.hashToUnit(`${experimentKey}:${userId}:${this.salt}`);
    let cumulative = 0;
    for (const variant of weights) {
      cumulative += variant.weight ?? 0;
      if (bucket <= cumulative) return variant;
    }
    return weights[weights.length - 1];
  }

  private hashToUnit(value: string) {
    const hash = createHash('sha256').update(value).digest('hex');
    const int = parseInt(hash.slice(0, 8), 16);
    return (int % 10_000) / 10_000;
  }
}

function normalizeWeights(variants: ExperimentVariant[]): ExperimentVariant[] {
  const total = variants.reduce(
    (sum, variant) => sum + (variant.weight ?? 1),
    0
  );
  return variants.map((variant) => ({
    ...variant,
    weight: (variant.weight ?? 1) / total,
  }));
}

import { createHash } from 'node:crypto';
import { ExperimentRunner } from '../experiments/runner';
import type { ExperimentAssignment } from '../types';
import type {
  SpecAssignment,
  SpecExperimentConfig,
  SpecVariantBinding,
} from './types';

export interface SpecExperimentRunnerOptions {
  runner?: ExperimentRunner;
  salt?: string;
}

export class SpecExperimentRunner {
  private readonly runner: ExperimentRunner;
  private readonly salt: string;

  constructor(options: SpecExperimentRunnerOptions = {}) {
    this.runner = options.runner ?? new ExperimentRunner();
    this.salt = options.salt ?? 'spec-experiment';
  }

  assign(
    config: SpecExperimentConfig,
    userId: string,
    context?: Record<string, string>
  ): SpecAssignment & { assignment: ExperimentAssignment } {
    const assignment = this.runner.assign(config.experiment, userId, context);
    const variant = this.pickVariant(config, assignment.variantId, userId);
    return {
      assignment,
      spec: variant?.spec ?? config.control,
      variantId: variant?.id ?? config.experiment.variants[0]?.id ?? 'control',
      experimentKey: `${config.experiment.key}.v${config.experiment.version}`,
    };
  }

  private pickVariant(
    config: SpecExperimentConfig,
    variantId: string,
    userId: string
  ): SpecVariantBinding | undefined {
    const variant = config.variants.find((item) => item.id === variantId);
    if (!variant) return undefined;
    const rolloutPercentage =
      variant.rolloutPercentage ?? this.currentStageRollout(config) ?? 1;
    if (rolloutPercentage >= 1) return variant;
    const bucket = this.hashToUnit(
      `${config.experiment.key}:${userId}:${this.salt}`
    );
    if (bucket <= rolloutPercentage) return variant;
    return undefined;
  }

  private currentStageRollout(config: SpecExperimentConfig) {
    if (
      !config.rolloutStages ||
      config.rolloutStages.length === 0 ||
      config.activeStageIndex == null
    )
      return undefined;
    return config.rolloutStages[
      Math.min(config.activeStageIndex, config.rolloutStages.length - 1)
    ];
  }

  private hashToUnit(value: string) {
    const hash = createHash('sha256').update(value).digest('hex');
    const int = parseInt(hash.slice(0, 8), 16);
    return (int % 10_000) / 10_000;
  }
}











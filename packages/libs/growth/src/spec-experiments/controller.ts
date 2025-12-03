import type {
  OperationCoordinate,
  SpecExperimentConfig,
  SpecExperimentEvaluation,
} from './types';
import type { SpecExperimentRegistry } from './registry';
import { SpecExperimentAnalyzer } from './analysis';

export interface SpecExperimentControllerOptions {
  registry: SpecExperimentRegistry;
  analyzer: SpecExperimentAnalyzer;
  onRollback?: (
    target: OperationCoordinate,
    evaluation: SpecExperimentEvaluation
  ) => Promise<void> | void;
  onAdvance?: (
    target: OperationCoordinate,
    evaluation: SpecExperimentEvaluation
  ) => Promise<void> | void;
}

export class SpecExperimentController {
  constructor(private readonly options: SpecExperimentControllerOptions) {}

  async evaluate(target: OperationCoordinate) {
    const config = this.requireConfig(target);
    const evaluation = await this.options.analyzer.evaluate(config);
    if (evaluation.shouldRollback) {
      this.rollback(config);
      if (this.options.onRollback) {
        await this.options.onRollback(target, evaluation);
      }
    } else if (this.advance(config)) {
      if (this.options.onAdvance) {
        await this.options.onAdvance(target, evaluation);
      }
    } else if (
      config.rolloutStages &&
      (config.activeStageIndex ?? 0) >= config.rolloutStages.length - 1
    ) {
      config.status = 'completed';
    } else {
      config.status = 'running';
    }
    return evaluation;
  }

  private requireConfig(target: OperationCoordinate) {
    const config = this.options.registry.get(target);
    if (!config) {
      throw new Error(
        `Spec experiment not found for ${target.name}.v${target.version}`
      );
    }
    return config;
  }

  private rollback(config: SpecExperimentConfig) {
    config.activeStageIndex = Math.max(0, (config.activeStageIndex ?? 0) - 1);
    config.status = 'rolled_back';
  }

  private advance(config: SpecExperimentConfig) {
    if (!config.rolloutStages?.length) return false;
    const nextStage = (config.activeStageIndex ?? 0) + 1;
    if (nextStage >= config.rolloutStages.length) return false;
    config.activeStageIndex = nextStage;
    config.status = 'running';
    return true;
  }
}


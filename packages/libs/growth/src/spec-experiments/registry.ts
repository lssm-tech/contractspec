import type { SpecExperimentConfig, OperationCoordinate } from './types';

export class SpecExperimentRegistry {
  private readonly experiments = new Map<string, SpecExperimentConfig>();

  register(config: SpecExperimentConfig): this {
    const key = this.key(config.target);
    this.experiments.set(key, config);
    return this;
  }

  get(target: OperationCoordinate): SpecExperimentConfig | undefined {
    return this.experiments.get(this.key(target));
  }

  list() {
    return [...this.experiments.values()];
  }

  private key(target: OperationCoordinate) {
    return `${target.name}.v${target.version}`;
  }
}


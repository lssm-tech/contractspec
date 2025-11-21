import type { ExperimentDefinition } from '../types';

export class ExperimentRegistry {
  private readonly experiments = new Map<string, ExperimentDefinition>();

  register(experiment: ExperimentDefinition): this {
    const key = this.makeKey(experiment.key, experiment.version);
    if (this.experiments.has(key)) {
      throw new Error(`Experiment ${key} already registered`);
    }
    this.experiments.set(key, experiment);
    return this;
  }

  get(key: string, version?: number): ExperimentDefinition | undefined {
    if (version != null) return this.experiments.get(this.makeKey(key, version));
    const candidates = [...this.experiments.values()].filter((exp) => exp.key === key);
    return candidates.sort((a, b) => b.version - a.version)[0];
  }

  list(): ExperimentDefinition[] {
    return [...this.experiments.values()].sort((a, b) => a.key.localeCompare(b.key));
  }

  private makeKey(key: string, version: number) {
    return `${key}.v${version}`;
  }
}

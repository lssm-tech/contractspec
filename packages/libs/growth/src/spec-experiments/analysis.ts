import { StatsEngine } from '../stats/engine';
import type { ExperimentTracker } from '../tracker/tracker';
import type { SpecExperimentConfig, SpecExperimentEvaluation } from './types';

export class SpecExperimentAnalyzer {
  constructor(
    private readonly tracker: ExperimentTracker,
    private readonly stats = new StatsEngine()
  ) {}

  async evaluate(
    config: SpecExperimentConfig
  ): Promise<SpecExperimentEvaluation> {
    const experimentKey = `${config.experiment.key}.v${config.experiment.version}`;
    const latencySamples = await this.tracker.getSamples(
      experimentKey,
      'latency_ms'
    );
    const errorSamples = await this.tracker.getSamples(
      experimentKey,
      'error_rate'
    );
    const latencyStats = this.stats.summarize(latencySamples, 'latency_ms');
    this.stats.summarize(errorSamples, 'error_rate');

    const p99Latency = this.estimateP99(latencySamples);
    const errorRate = this.estimateErrorRate(errorSamples);

    const reasons: string[] = [];
    if (
      config.guardrails?.latencyP99ThresholdMs &&
      p99Latency > config.guardrails.latencyP99ThresholdMs
    ) {
      reasons.push(
        `Latency P99 ${p99Latency.toFixed(1)}ms exceeded threshold ${config.guardrails.latencyP99ThresholdMs}ms`
      );
    }
    if (
      config.guardrails?.errorRateThreshold &&
      errorRate > config.guardrails.errorRateThreshold
    ) {
      reasons.push(
        `Error rate ${errorRate.toFixed(3)} exceeded threshold ${config.guardrails.errorRateThreshold}`
      );
    }

    return {
      shouldRollback: reasons.length > 0,
      reasons,
      latencyP99: p99Latency,
      errorRate,
      winner: latencyStats.winner,
      pValue: latencyStats.pValue,
    };
  }

  private estimateP99(samples: { value: number }[]) {
    if (!samples.length) return 0;
    const sorted = samples.map((sample) => sample.value).sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.99);
    return sorted[Math.min(index, sorted.length - 1)]!;
  }

  private estimateErrorRate(samples: { value: number }[]) {
    if (!samples.length) return 0;
    const total = samples.length;
    const errors = samples.filter((sample) => sample.value > 0).length;
    return errors / total;
  }
}



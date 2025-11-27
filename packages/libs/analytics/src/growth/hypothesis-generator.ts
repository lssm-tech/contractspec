import type { GrowthHypothesis, GrowthMetric } from '../types';

export interface HypothesisGeneratorOptions {
  minDelta?: number;
}

export class GrowthHypothesisGenerator {
  private readonly minDelta: number;

  constructor(options?: HypothesisGeneratorOptions) {
    this.minDelta = options?.minDelta ?? 0.05;
  }

  generate(metrics: GrowthMetric[]): GrowthHypothesis[] {
    return metrics
      .map((metric) => this.fromMetric(metric))
      .filter((hypothesis): hypothesis is GrowthHypothesis =>
        Boolean(hypothesis)
      );
  }

  private fromMetric(metric: GrowthMetric): GrowthHypothesis | null {
    const change = this.delta(metric);
    if (Math.abs(change) < this.minDelta) return null;
    const direction = change > 0 ? 'rising' : 'declining';
    const statement = this.statement(metric, change, direction);
    return {
      statement,
      metric: metric.name,
      confidence: Math.abs(change) > 0.2 ? 'high' : 'medium',
      impact: this.impact(metric),
    };
  }

  private delta(metric: GrowthMetric): number {
    if (metric.previous == null) return 0;
    const prev = metric.previous || 1;
    return (metric.current - prev) / Math.abs(prev);
  }

  private impact(metric: GrowthMetric): GrowthHypothesis['impact'] {
    if (metric.target && metric.current < metric.target * 0.8) return 'high';
    if (metric.target && metric.current < metric.target) return 'medium';
    return 'low';
  }

  private statement(
    metric: GrowthMetric,
    change: number,
    direction: string
  ): string {
    const percent = Math.abs(parseFloat((change * 100).toFixed(1)));
    if (direction === 'declining') {
      return `${metric.name} is down ${percent}% vs last period; test new onboarding prompts to recover activation.`;
    }
    return `${metric.name} grew ${percent}% period-over-period; double down with expanded experiment or pricing test.`;
  }
}

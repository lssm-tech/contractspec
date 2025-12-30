import type {
  CanaryStage,
  DeploymentMetrics,
  DeploymentThresholds,
} from './types';

export interface AnalysisResult {
  status: 'pass' | 'fail';
  reasons: string[];
  metrics: DeploymentMetrics;
}

export class CanaryAnalyzer {
  constructor(private readonly defaults: DeploymentThresholds) {}

  evaluate(stage: CanaryStage, metrics: DeploymentMetrics): AnalysisResult {
    const thresholds = { ...this.defaults, ...stage.thresholds };
    const reasons: string[] = [];

    if (metrics.errorRate > thresholds.errorRate) {
      reasons.push(
        `errorRate ${metrics.errorRate.toFixed(4)} > ${thresholds.errorRate}`
      );
    }

    if (
      typeof thresholds.latencyP50 === 'number' &&
      metrics.latencyP50 > thresholds.latencyP50
    ) {
      reasons.push(
        `latencyP50 ${metrics.latencyP50}ms > ${thresholds.latencyP50}ms`
      );
    }

    if (
      typeof thresholds.latencyP95 === 'number' &&
      metrics.latencyP95 > thresholds.latencyP95
    ) {
      reasons.push(
        `latencyP95 ${metrics.latencyP95}ms > ${thresholds.latencyP95}ms`
      );
    }

    if (
      typeof thresholds.latencyP99 === 'number' &&
      metrics.latencyP99 > thresholds.latencyP99
    ) {
      reasons.push(
        `latencyP99 ${metrics.latencyP99}ms > ${thresholds.latencyP99}ms`
      );
    }

    if (
      typeof thresholds.throughputDrop === 'number' &&
      metrics.throughput < thresholds.throughputDrop
    ) {
      reasons.push(
        `throughput ${metrics.throughput} < ${thresholds.throughputDrop}`
      );
    }

    if (thresholds.customEvaluator && !thresholds.customEvaluator(metrics)) {
      reasons.push('custom evaluator reported failure');
    }

    return {
      status: reasons.length === 0 ? 'pass' : 'fail',
      reasons,
      metrics,
    };
  }
}

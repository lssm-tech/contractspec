import { BaselineCalculator, type MetricPoint } from './baseline-calculator';

export interface AnomalyThresholds {
  errorRateDelta?: number;
  latencyDelta?: number;
  throughputDrop?: number;
  minSamples?: number;
}

export interface AnomalySignal {
  type: 'error_rate_spike' | 'latency_regression' | 'throughput_drop';
  delta: number;
  point: MetricPoint;
  baseline: ReturnType<BaselineCalculator['getSnapshot']>;
}

export class AnomalyDetector {
  private readonly baseline: BaselineCalculator;
  private readonly thresholds: Required<AnomalyThresholds> = {
    errorRateDelta: 0.5,
    latencyDelta: 0.35,
    throughputDrop: 0.4,
    minSamples: 10,
  } as Required<AnomalyThresholds>;

  constructor(options: AnomalyThresholds = {}) {
    this.baseline = new BaselineCalculator();
    this.thresholds = { ...this.thresholds, ...options };
  }

  evaluate(point: MetricPoint): AnomalySignal[] {
    const baselineSnapshot = this.baseline.update(point);
    if (baselineSnapshot.sampleCount < this.thresholds.minSamples) {
      return [];
    }

    const signals: AnomalySignal[] = [];

    const errorDelta = this.relativeDelta(
      point.errorRate,
      baselineSnapshot.errorRate
    );
    if (errorDelta > this.thresholds.errorRateDelta) {
      signals.push({
        type: 'error_rate_spike',
        delta: errorDelta,
        point,
        baseline: baselineSnapshot,
      });
    }

    const latencyDelta = this.relativeDelta(
      point.latencyP99,
      baselineSnapshot.latencyP99
    );
    if (latencyDelta > this.thresholds.latencyDelta) {
      signals.push({
        type: 'latency_regression',
        delta: latencyDelta,
        point,
        baseline: baselineSnapshot,
      });
    }

    const throughputDelta = this.relativeDrop(
      point.throughput,
      baselineSnapshot.throughput
    );
    if (throughputDelta > this.thresholds.throughputDrop) {
      signals.push({
        type: 'throughput_drop',
        delta: throughputDelta,
        point,
        baseline: baselineSnapshot,
      });
    }

    return signals;
  }

  private relativeDelta(value: number, baseline: number) {
    if (baseline === 0) {
      return 0;
    }
    return (value - baseline) / baseline;
  }

  private relativeDrop(value: number, baseline: number) {
    if (baseline === 0) {
      return 0;
    }
    return (baseline - value) / baseline;
  }
}

export interface MetricPoint {
  latencyP99: number;
  latencyP95: number;
  errorRate: number;
  throughput: number;
  timestamp: Date;
}

export interface BaselineSnapshot {
  latencyP99: number;
  latencyP95: number;
  errorRate: number;
  throughput: number;
  sampleCount: number;
}

export class BaselineCalculator {
  private snapshot: BaselineSnapshot = {
    latencyP99: 0,
    latencyP95: 0,
    errorRate: 0,
    throughput: 0,
    sampleCount: 0,
  };

  constructor(private readonly alpha: number = 0.2) {}

  update(point: MetricPoint): BaselineSnapshot {
    const { sampleCount } = this.snapshot;
    const nextCount = sampleCount + 1;
    const weight = sampleCount === 0 ? 1 : this.alpha;

    this.snapshot = {
      latencyP99: this.mix(this.snapshot.latencyP99, point.latencyP99, weight),
      latencyP95: this.mix(this.snapshot.latencyP95, point.latencyP95, weight),
      errorRate: this.mix(this.snapshot.errorRate, point.errorRate, weight),
      throughput: this.mix(this.snapshot.throughput, point.throughput, weight),
      sampleCount: nextCount,
    };

    return this.snapshot;
  }

  getSnapshot() {
    return this.snapshot;
  }

  private mix(current: number, next: number, weight: number) {
    if (this.snapshot.sampleCount === 0) {
      return next;
    }
    return current * (1 - weight) + next * weight;
  }
}

import type { CanaryStage, DeploymentMode, TrafficSplit } from './types';

export class TrafficShifter {
  constructor(private readonly mode: DeploymentMode) {}

  computeSplit(stage: CanaryStage): TrafficSplit {
    if (this.mode === 'blue-green') {
      return stage.percentage >= 100
        ? { stable: 0, candidate: 1 }
        : { stable: 1, candidate: 0 };
    }

    const candidate = Math.min(Math.max(stage.percentage / 100, 0), 1);
    return {
      candidate,
      stable: 1 - candidate,
    };
  }
}

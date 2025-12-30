import { BurnRateCalculator } from './burn-rate-calculator';
import type { SLODefinition, SLOSnapshot, SLOWindowSample } from './types';

export interface SLOTrackerOptions {
  definition: SLODefinition;
  historyLimit?: number;
}

export class SLOTracker {
  private readonly burnRate: BurnRateCalculator;
  private readonly history: SLOSnapshot[] = [];
  private readonly historyLimit: number;

  constructor(private readonly options: SLOTrackerOptions) {
    this.burnRate = new BurnRateCalculator(options.definition);
    this.historyLimit = options.historyLimit ?? 200;
  }

  recordWindow(sample: SLOWindowSample): SLOSnapshot {
    const total = sample.good + sample.bad;
    const availability = total === 0 ? 1 : sample.good / total;
    const burnResult = this.burnRate.calculate(sample);
    const snapshot: SLOSnapshot = {
      definition: this.options.definition,
      availability,
      latencyP99: sample.latencyP99,
      latencyP95: sample.latencyP95,
      errorBudget: {
        remaining: Math.max(0, 1 - burnResult.errorBudgetConsumed),
        consumed: burnResult.errorBudgetConsumed,
        windowMs: burnResult.windowMs,
        updatedAt: sample.timestamp ?? new Date(),
      },
      sample,
    };

    this.history.push(snapshot);
    if (this.history.length > this.historyLimit) {
      this.history.shift();
    }

    return snapshot;
  }

  getHistory() {
    return [...this.history];
  }
}

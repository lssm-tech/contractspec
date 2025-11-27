import type { SLODefinition, SLOWindowSample } from './types';

export interface BurnRateResult {
  burnRate: number;
  errorBudgetConsumed: number;
  windowMs: number;
}

export class BurnRateCalculator {
  constructor(private readonly definition: SLODefinition) {}

  calculate(sample: SLOWindowSample): BurnRateResult {
    const total = sample.good + sample.bad;
    if (total === 0) {
      return {
        burnRate: 0,
        errorBudgetConsumed: 0,
        windowMs: sample.timeframeMs ?? this.definition.rollingWindowMs,
      };
    }

    const actualAvailability = sample.good / total;
    const target = this.definition.targetAvailability;
    const errorBudget = 1 - target;
    const errorBudgetSpent = Math.max(0, target - actualAvailability);

    const windowMs = sample.timeframeMs ?? this.definition.rollingWindowMs;
    const burnRate = errorBudget === 0 ? 0 : errorBudgetSpent / errorBudget;

    return {
      burnRate,
      errorBudgetConsumed: errorBudgetSpent,
      windowMs,
    };
  }
}

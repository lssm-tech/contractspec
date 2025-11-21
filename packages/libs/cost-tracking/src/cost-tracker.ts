import { calculateSampleCost, defaultCostModel } from './cost-model';
import type { CostModel, CostSample, OperationCostSummary } from './types';

export interface CostTrackerOptions {
  costModel?: CostModel;
  onSampleRecorded?: (sample: CostSample, total: number) => void;
}

export class CostTracker {
  private readonly totals = new Map<string, OperationCostSummary>();
  private readonly costModel: CostModel;

  constructor(private readonly options: CostTrackerOptions = {}) {
    this.costModel = options.costModel ?? defaultCostModel;
  }

  recordSample(sample: CostSample): OperationCostSummary {
    const breakdown = calculateSampleCost(sample, this.costModel);
    const total =
      breakdown.dbReads +
      breakdown.dbWrites +
      breakdown.compute +
      breakdown.memory +
      breakdown.external +
      breakdown.custom;

    const key = this.buildKey(sample.operation, sample.tenantId);
    const existing = this.totals.get(key);

    const summary: OperationCostSummary = existing
      ? {
          ...existing,
          total: existing.total + total,
          breakdown: {
            dbReads: existing.breakdown.dbReads + breakdown.dbReads,
            dbWrites: existing.breakdown.dbWrites + breakdown.dbWrites,
            compute: existing.breakdown.compute + breakdown.compute,
            memory: existing.breakdown.memory + breakdown.memory,
            external: existing.breakdown.external + breakdown.external,
            custom: existing.breakdown.custom + breakdown.custom,
          },
          samples: existing.samples + 1,
        }
      : {
          operation: sample.operation,
          tenantId: sample.tenantId,
          total,
          breakdown: {
            dbReads: breakdown.dbReads,
            dbWrites: breakdown.dbWrites,
            compute: breakdown.compute,
            memory: breakdown.memory,
            external: breakdown.external,
            custom: breakdown.custom,
          },
          samples: 1,
        };

    this.totals.set(key, summary);
    this.options.onSampleRecorded?.(sample, total);
    return summary;
  }

  getTotals(filter?: { tenantId?: string }) {
    const items = Array.from(this.totals.values());
    if (!filter?.tenantId) {
      return items;
    }
    return items.filter((item) => item.tenantId === filter.tenantId);
  }

  reset() {
    this.totals.clear();
  }

  private buildKey(operation: string, tenantId?: string) {
    return tenantId ? `${tenantId}:${operation}` : operation;
  }
}

import type { OperationCostSummary, TenantBudget } from './types';

export interface BudgetAlertManagerOptions {
  budgets: TenantBudget[];
  onAlert?: (payload: {
    tenantId: string;
    limit: number;
    total: number;
    summary: OperationCostSummary;
  }) => void;
}

export class BudgetAlertManager {
  private readonly limits = new Map<string, TenantBudget>();
  private readonly spend = new Map<string, number>();

  constructor(private readonly options: BudgetAlertManagerOptions) {
    for (const budget of options.budgets) {
      this.limits.set(budget.tenantId, budget);
      this.spend.set(budget.tenantId, 0);
    }
  }

  track(summary: OperationCostSummary) {
    if (!summary.tenantId) {
      return;
    }

    const current = (this.spend.get(summary.tenantId) ?? 0) + summary.total;
    this.spend.set(summary.tenantId, current);

    const budget = this.limits.get(summary.tenantId);
    if (!budget) {
      return;
    }

    const threshold = budget.alertThreshold ?? 0.8;
    if (current >= budget.monthlyLimit * threshold) {
      this.options.onAlert?.({
        tenantId: summary.tenantId,
        limit: budget.monthlyLimit,
        total: current,
        summary,
      });
    }
  }

  getSpend(tenantId: string) {
    return this.spend.get(tenantId) ?? 0;
  }
}

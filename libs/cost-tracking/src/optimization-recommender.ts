import type { OperationCostSummary, OptimizationSuggestion } from './types';

export class OptimizationRecommender {
  generate(summary: OperationCostSummary): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const avgCost = summary.total / summary.samples;

    if (summary.breakdown.dbReads / summary.samples > 1000) {
      suggestions.push({
        operation: summary.operation,
        tenantId: summary.tenantId,
        category: 'n_plus_one',
        message:
          'High average DB read count detected. Consider batching queries or adding pagination.',
        evidence: { avgReads: summary.breakdown.dbReads / summary.samples },
      });
    }

    if (summary.breakdown.compute / summary.total > 0.6) {
      suggestions.push({
        operation: summary.operation,
        tenantId: summary.tenantId,
        category: 'batching',
        message:
          'Compute dominates cost. Investigate hot loops or move heavy logic to background jobs.',
        evidence: { computeShare: summary.breakdown.compute / summary.total },
      });
    }

    if (summary.breakdown.external > avgCost * 0.5) {
      suggestions.push({
        operation: summary.operation,
        tenantId: summary.tenantId,
        category: 'external',
        message:
          'External provider spend is high. Reuse results or enable caching.',
        evidence: { externalCost: summary.breakdown.external },
      });
    }

    if (summary.breakdown.memory > summary.breakdown.compute * 1.2) {
      suggestions.push({
        operation: summary.operation,
        tenantId: summary.tenantId,
        category: 'caching',
        message:
          'Memory utilization suggests cached payloads linger. Tune TTL or stream responses.',
        evidence: { memoryCost: summary.breakdown.memory },
      });
    }

    return suggestions;
  }
}

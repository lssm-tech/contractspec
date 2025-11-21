import type { BehaviorStore } from './store';
import type { BehaviorInsights, BehaviorQuery, BehaviorSummary } from './types';

export interface BehaviorAnalyzerOptions {
  fieldInactivityThreshold?: number;
  minSamples?: number;
}

export interface AnalyzeParams {
  tenantId: string;
  userId?: string;
  role?: string;
  windowMs?: number;
}

const DEFAULT_THRESHOLD = 3;

export class BehaviorAnalyzer {
  constructor(
    private readonly store: BehaviorStore,
    private readonly options: BehaviorAnalyzerOptions = {}
  ) {}

  async analyze(params: AnalyzeParams): Promise<BehaviorInsights> {
    const query: BehaviorQuery = {
      tenantId: params.tenantId,
      userId: params.userId,
      role: params.role,
    };

    if (params.windowMs) {
      query.since = Date.now() - params.windowMs;
    }

    const summary = await this.store.summarize(query);
    return buildInsights(summary, this.options);
  }
}

function buildInsights(
  summary: BehaviorSummary,
  options: BehaviorAnalyzerOptions
): BehaviorInsights {
  const threshold = options.fieldInactivityThreshold ?? DEFAULT_THRESHOLD;
  const minSamples = options.minSamples ?? 10;

  const ignoredFields: string[] = [];
  const frequentlyUsedFields: string[] = [];

  for (const [field, count] of Object.entries(summary.fieldCounts)) {
    if (count <= threshold) {
      ignoredFields.push(field);
    }
    if (count >= threshold * 4) {
      frequentlyUsedFields.push(field);
    }
  }

  const workflowBottlenecks = Object.entries(
    summary.workflowStepCounts
  ).flatMap(([workflow, steps]) => {
    const total = Object.values(steps).reduce((acc, value) => acc + value, 0);
    if (!total || total < minSamples) {
      return [];
    }
    return Object.entries(steps)
      .filter(([, count]) => count / total < 0.4)
      .map(([step, count]) => ({
        workflow,
        step,
        dropRate: 1 - count / total,
      }));
  });

  const layoutPreference = detectLayout(summary);

  return {
    unusedFields: ignoredFields,
    suggestedHiddenFields: ignoredFields.slice(0, 5),
    frequentlyUsedFields: frequentlyUsedFields.slice(0, 10),
    workflowBottlenecks,
    layoutPreference,
  };
}

function detectLayout(
  summary: BehaviorSummary
): BehaviorInsights['layoutPreference'] {
  const fieldCount = Object.keys(summary.fieldCounts).length;
  if (!fieldCount) {
    return undefined;
  }

  if (fieldCount >= 15) {
    return 'table';
  }
  if (fieldCount >= 8) {
    return 'grid';
  }
  return 'form';
}

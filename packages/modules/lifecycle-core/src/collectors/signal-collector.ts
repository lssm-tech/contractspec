import type {
  LifecycleAssessmentInput,
  LifecycleAxes,
  LifecycleMetricSnapshot,
  LifecycleSignal,
} from '@contractspec/lib.lifecycle';
import {
  CapitalPhase,
  CompanyPhase,
  ProductPhase,
} from '@contractspec/lib.lifecycle';
import type { AnalyticsAdapter } from '../adapters/analytics-adapter';
import type { QuestionnaireAdapter } from '../adapters/questionnaire-adapter';
import type { IntentAdapter } from '../adapters/intent-adapter';

const DEFAULT_AXES: LifecycleAxes = {
  product: ProductPhase.Sketch,
  company: CompanyPhase.Solo,
  capital: CapitalPhase.Bootstrapped,
};

export interface StageSignalCollectorOptions {
  analyticsAdapter?: AnalyticsAdapter;
  questionnaireAdapter?: QuestionnaireAdapter;
  intentAdapter?: IntentAdapter;
}

export interface StageSignalCollectorResult {
  axes: LifecycleAxes;
  metrics: LifecycleMetricSnapshot;
  signals: LifecycleSignal[];
  questionnaireAnswers?: Record<string, unknown>;
}

export class StageSignalCollector {
  private readonly options: StageSignalCollectorOptions;

  constructor(options: StageSignalCollectorOptions) {
    this.options = options;
  }

  async collect(
    input: LifecycleAssessmentInput = {}
  ): Promise<StageSignalCollectorResult> {
    const axes: LifecycleAxes = {
      ...DEFAULT_AXES,
      ...(input.axes ?? {}),
    };
    const metricsSnapshots: LifecycleMetricSnapshot[] = [];
    const aggregatedSignals: LifecycleSignal[] = [...(input.signals ?? [])];
    const questionnaireAnswers: Record<string, unknown> = {
      ...(input.questionnaireAnswers ?? {}),
    };

    if (input.metrics) {
      metricsSnapshots.push(input.metrics);
    }

    if (this.options.analyticsAdapter) {
      const result = await this.options.analyticsAdapter.fetch();
      if (result.axes) Object.assign(axes, result.axes);
      if (result.metrics) metricsSnapshots.push(result.metrics);
      if (result.signals) aggregatedSignals.push(...result.signals);
    }

    if (this.options.questionnaireAdapter) {
      const result = await this.options.questionnaireAdapter.fetch();
      if (result.axes) Object.assign(axes, result.axes);
      if (result.signals) aggregatedSignals.push(...result.signals);
      Object.assign(questionnaireAnswers, result.answers);
    }

    if (this.options.intentAdapter) {
      const result = await this.options.intentAdapter.fetch();
      if (result.signals) aggregatedSignals.push(...result.signals);
    }

    const metrics = mergeMetricSnapshots(metricsSnapshots);

    return {
      axes,
      metrics,
      signals: dedupeSignals(aggregatedSignals),
      questionnaireAnswers: Object.keys(questionnaireAnswers).length
        ? questionnaireAnswers
        : undefined,
    };
  }
}

const mergeMetricSnapshots = (
  snapshots: LifecycleMetricSnapshot[]
): LifecycleMetricSnapshot =>
  snapshots.reduce<LifecycleMetricSnapshot>((acc, snapshot) => {
    Object.entries(snapshot ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key as keyof LifecycleMetricSnapshot] = value as never;
      }
    });
    return acc;
  }, {});

const dedupeSignals = (signals: LifecycleSignal[]): LifecycleSignal[] => {
  const seen = new Set<string>();
  return signals.filter((signal) => {
    if (!signal.id) return true;
    if (seen.has(signal.id)) return false;
    seen.add(signal.id);
    return true;
  });
};

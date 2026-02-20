import type {
  LifecycleAssessment,
  LifecycleAssessmentInput,
  LifecycleMilestone,
  LifecycleMetricSnapshot,
} from '@contractspec/lib.lifecycle';
import {
  LIFECYCLE_STAGE_META,
  LifecycleStage,
  getLocalizedStageMeta,
} from '@contractspec/lib.lifecycle';
import { StageSignalCollector } from '../collectors/signal-collector';
import { StageScorer } from '../scoring/stage-scorer';
import { LifecycleMilestonePlanner } from '../planning/milestone-planner';

export interface LifecycleOrchestratorOptions {
  collector: StageSignalCollector;
  scorer: StageScorer;
  milestonePlanner?: LifecycleMilestonePlanner;
  /** Locale for localized stage metadata */
  locale?: string;
}

export class LifecycleOrchestrator {
  private readonly collector: StageSignalCollector;
  private readonly scorer: StageScorer;
  private readonly planner?: LifecycleMilestonePlanner;
  private readonly locale?: string;

  constructor(options: LifecycleOrchestratorOptions) {
    this.collector = options.collector;
    this.scorer = options.scorer;
    this.planner = options.milestonePlanner;
    this.locale = options.locale;
  }

  async run(input?: LifecycleAssessmentInput): Promise<LifecycleAssessment> {
    const collected = await this.collector.collect(input);
    const scorecard = this.scorer.score({
      metrics: collected.metrics,
      signals: collected.signals,
    });
    const top = scorecard[0] ?? fallbackScore();
    const stageMeta = this.locale
      ? getLocalizedStageMeta(this.locale)
      : LIFECYCLE_STAGE_META;
    const meta = stageMeta[top.stage];

    return {
      stage: top.stage,
      confidence: top.confidence,
      axes: collected.axes,
      signals: collected.signals,
      metrics: toMetricRecord(collected.metrics),
      gaps: meta.focusAreas.slice(0, 3),
      focusAreas: meta.focusAreas,
      scorecard,
      generatedAt: new Date().toISOString(),
    };
  }

  getUpcomingMilestones(
    stage: LifecycleStage,
    completedMilestoneIds: string[] = [],
    limit = 5
  ): LifecycleMilestone[] {
    if (!this.planner) return [];
    return this.planner.getUpcoming(stage, completedMilestoneIds, limit);
  }
}

const fallbackScore = () => ({
  stage: LifecycleStage.Exploration,
  score: 0.3,
  confidence: 0.3,
  supportingSignals: [],
});

const toMetricRecord = (
  snapshot: LifecycleMetricSnapshot
): Record<string, number | undefined> =>
  Object.entries(snapshot ?? {}).reduce<Record<string, number | undefined>>(
    (acc, [key, value]) => {
      if (typeof value === 'number') {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

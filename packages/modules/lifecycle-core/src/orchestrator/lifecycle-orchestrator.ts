import type {
  LifecycleAssessment,
  LifecycleAssessmentInput,
  LifecycleMilestone,
} from '@lssm/lib.lifecycle';
import { LIFECYCLE_STAGE_META, LifecycleStage } from '@lssm/lib.lifecycle';
import { StageSignalCollector } from '../collectors/signal-collector';
import { StageScorer } from '../scoring/stage-scorer';
import { LifecycleMilestonePlanner } from '../planning/milestone-planner';

export interface LifecycleOrchestratorOptions {
  collector: StageSignalCollector;
  scorer: StageScorer;
  milestonePlanner?: LifecycleMilestonePlanner;
}

export class LifecycleOrchestrator {
  private readonly collector: StageSignalCollector;
  private readonly scorer: StageScorer;
  private readonly planner?: LifecycleMilestonePlanner;

  constructor(options: LifecycleOrchestratorOptions) {
    this.collector = options.collector;
    this.scorer = options.scorer;
    this.planner = options.milestonePlanner;
  }

  async run(input?: LifecycleAssessmentInput): Promise<LifecycleAssessment> {
    const collected = await this.collector.collect(input);
    const scorecard = this.scorer.score({
      metrics: collected.metrics,
      signals: collected.signals,
    });
    const top = scorecard[0] ?? fallbackScore();
    const meta = LIFECYCLE_STAGE_META[top.stage];

    return {
      stage: top.stage,
      confidence: top.confidence,
      axes: collected.axes,
      signals: collected.signals,
      metrics: collected.metrics,
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

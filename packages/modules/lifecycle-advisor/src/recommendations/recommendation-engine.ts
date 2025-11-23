import type {
  LifecycleAction,
  LifecycleAssessment,
  LifecycleMilestone,
  LifecycleRecommendation,
} from '@contractspec/lib.lifecycle';
import {
  LIFECYCLE_STAGE_META,
  LifecycleStage,
} from '@contractspec/lib.lifecycle';
import stagePlaybooks, {
  type StagePlaybookData,
} from '../data/stage-playbooks';

type StagePlaybook = StagePlaybookData;

export interface RecommendationOptions {
  limit?: number;
  upcomingMilestones?: LifecycleMilestone[];
}

const PLAYBOOK_MAP = new Map<LifecycleStage, StagePlaybook>(
  stagePlaybooks.map((entry) => [
    entry.stage,
    {
      ...entry,
      stage: entry.stage as LifecycleStage,
    },
  ])
);

export class LifecycleRecommendationEngine {
  private readonly playbooks: Map<LifecycleStage, StagePlaybook>;

  constructor(overrides?: StagePlaybook[]) {
    this.playbooks = overrides?.length
      ? new Map(overrides.map((entry) => [entry.stage, entry]))
      : PLAYBOOK_MAP;
  }

  generate(
    assessment: LifecycleAssessment,
    options: RecommendationOptions = {}
  ): LifecycleRecommendation {
    const entry =
      this.playbooks.get(assessment.stage) ??
      createFallbackPlaybook(assessment.stage);
    const limit = options.limit ?? 3;
    const actions = (entry.actions ?? []).slice(0, limit);
    const finalActions =
      actions.length > 0 ? actions : fallbackActions(assessment, limit);

    return {
      assessmentId: assessment.generatedAt,
      stage: assessment.stage,
      actions: finalActions,
      upcomingMilestones: options.upcomingMilestones ?? [],
      ceremony: entry.ceremony,
    };
  }
}

const createFallbackPlaybook = (stage: LifecycleStage): StagePlaybook => ({
  stage,
  actions: [],
  focusAreas: LIFECYCLE_STAGE_META[stage].focusAreas,
});

const fallbackActions = (
  assessment: LifecycleAssessment,
  limit: number
): LifecycleAction[] =>
  (assessment.focusAreas ?? LIFECYCLE_STAGE_META[assessment.stage].focusAreas)
    .slice(0, limit)
    .map((focus, index) => ({
      id: `fallback-${assessment.stage}-${index}`,
      stage: assessment.stage,
      title: `Advance ${focus}`,
      description: `Identify one task that will improve "${focus}" this week.`,
      priority: index + 1,
      estimatedImpact: 'low',
      effortLevel: 's',
      category: 'product',
    }));



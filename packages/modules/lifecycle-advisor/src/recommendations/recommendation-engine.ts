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
  getLocalizedStagePlaybooks,
  type StagePlaybookData,
} from '../data/stage-playbooks';
import { createLifecycleAdvisorI18n } from '../i18n/messages';

type StagePlaybook = StagePlaybookData;

export interface RecommendationOptions {
  limit?: number;
  upcomingMilestones?: LifecycleMilestone[];
  /** Locale for translated action titles, descriptions, and ceremony copy. */
  locale?: string;
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
    const { locale, limit: rawLimit, upcomingMilestones } = options;
    const limit = rawLimit ?? 3;

    const entry = locale
      ? resolveLocalizedPlaybook(assessment.stage, locale)
      : (this.playbooks.get(assessment.stage) ??
        createFallbackPlaybook(assessment.stage));

    const actions = (entry.actions ?? []).slice(0, limit);
    const finalActions =
      actions.length > 0 ? actions : fallbackActions(assessment, limit, locale);

    return {
      assessmentId: assessment.generatedAt,
      stage: assessment.stage,
      actions: finalActions,
      upcomingMilestones: upcomingMilestones ?? [],
      ceremony: entry.ceremony,
    };
  }
}

function resolveLocalizedPlaybook(
  stage: LifecycleStage,
  locale: string
): StagePlaybook {
  const localized = getLocalizedStagePlaybooks(locale);
  return (
    localized.find((p) => p.stage === stage) ??
    createFallbackPlaybook(stage, locale)
  );
}

const createFallbackPlaybook = (
  stage: LifecycleStage,
  locale?: string
): StagePlaybook => ({
  stage,
  actions: [],
  focusAreas: locale
    ? (getLocalizedStagePlaybooks(locale).find((p) => p.stage === stage)
        ?.focusAreas ?? LIFECYCLE_STAGE_META[stage].focusAreas)
    : LIFECYCLE_STAGE_META[stage].focusAreas,
});

const fallbackActions = (
  assessment: LifecycleAssessment,
  limit: number,
  locale?: string
): LifecycleAction[] => {
  const i18n = locale ? createLifecycleAdvisorI18n(locale) : undefined;
  return (
    assessment.focusAreas ?? LIFECYCLE_STAGE_META[assessment.stage].focusAreas
  )
    .slice(0, limit)
    .map((focus, index) => ({
      id: `fallback-${assessment.stage}-${index}`,
      stage: assessment.stage,
      title: i18n
        ? i18n.t('engine.fallbackAction.title', { focus })
        : `Advance ${focus}`,
      description: i18n
        ? i18n.t('engine.fallbackAction.description', { focus })
        : `Identify one task that will improve "${focus}" this week.`,
      priority: index + 1,
      estimatedImpact: 'low',
      effortLevel: 's',
      category: 'product',
    }));
};

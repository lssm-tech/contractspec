import type {
  LifecycleAssessment,
  LifecycleRecommendation,
} from '../types/milestones';
import type { LifecycleAxes } from '../types/axes';
import {
  LIFECYCLE_STAGE_META,
  LIFECYCLE_STAGE_ORDER,
  LifecycleStage,
} from '../types/stages';
import type { LifecycleScore } from '../types/signals';

export interface StageSummary {
  title: string;
  question: string;
  highlights: string[];
  traps: string[];
  focusAreas: string[];
  axesSummary: string[];
}

export const formatStageSummary = (
  stage: LifecycleStage,
  assessment?: Pick<LifecycleAssessment, 'axes' | 'gaps'>
): StageSummary => {
  const meta = LIFECYCLE_STAGE_META[stage];
  const title = `Stage ${meta.order} · ${meta.name}`;
  const axesSummary = assessment ? summarizeAxes(assessment.axes) : [];

  return {
    title,
    question: meta.question,
    highlights: meta.signals,
    traps: meta.traps,
    focusAreas: assessment?.gaps?.length ? assessment.gaps : meta.focusAreas,
    axesSummary,
  };
};

export const summarizeAxes = (axes: LifecycleAxes): string[] => [
  `Product: ${axes.product}`,
  `Company: ${axes.company}`,
  `Capital: ${axes.capital}`,
];

export const rankStageCandidates = (
  scores: LifecycleScore[]
): LifecycleScore[] =>
  [...scores].sort((a, b) => {
    if (b.score === a.score) {
      return b.confidence - a.confidence;
    }
    return b.score - a.score;
  });

export const createRecommendationDigest = (
  recommendation: LifecycleRecommendation
): string => {
  const meta = LIFECYCLE_STAGE_META[recommendation.stage];
  const topAction = recommendation.actions[0];
  const actionCopy = topAction
    ? `${topAction.title} (${topAction.estimatedImpact} impact)`
    : 'Focus on upcoming milestones.';

  return `Next up for ${meta.name}: ${actionCopy}`;
};

export const getStageLabel = (stage: LifecycleStage): string =>
  LIFECYCLE_STAGE_META[stage].name;

export const getStageOrderIndex = (stage: LifecycleStage): number =>
  LIFECYCLE_STAGE_ORDER.indexOf(stage);




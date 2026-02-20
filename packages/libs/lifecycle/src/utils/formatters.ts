import type {
  LifecycleAssessment,
  LifecycleRecommendation,
} from '../types/milestones';
import type { LifecycleAxes } from '../types/axes';
import {
  LIFECYCLE_STAGE_META,
  LIFECYCLE_STAGE_ORDER,
  LifecycleStage,
  getLocalizedStageMeta,
} from '../types/stages';
import type { LifecycleScore } from '../types/signals';
import { createLifecycleI18n, getDefaultI18n } from '../i18n/messages';
import type { LifecycleI18n } from '../i18n/messages';

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
  assessment?: Pick<LifecycleAssessment, 'axes' | 'gaps'>,
  locale?: string
): StageSummary => {
  const i18n = locale ? createLifecycleI18n(locale) : getDefaultI18n();
  const stageMeta = locale
    ? getLocalizedStageMeta(locale)
    : LIFECYCLE_STAGE_META;
  const meta = stageMeta[stage];
  const title = i18n.t('formatter.stageTitle', {
    order: meta.order,
    name: meta.name,
  });
  const axesSummary = assessment ? summarizeAxes(assessment.axes, locale) : [];

  return {
    title,
    question: meta.question,
    highlights: meta.signals,
    traps: meta.traps,
    focusAreas: assessment?.gaps?.length ? assessment.gaps : meta.focusAreas,
    axesSummary,
  };
};

export const summarizeAxes = (
  axes: LifecycleAxes,
  locale?: string
): string[] => {
  const i18n = locale ? createLifecycleI18n(locale) : getDefaultI18n();
  return [
    i18n.t('formatter.axis.product', { phase: axes.product }),
    i18n.t('formatter.axis.company', { phase: axes.company }),
    i18n.t('formatter.axis.capital', { phase: axes.capital }),
  ];
};

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
  recommendation: LifecycleRecommendation,
  locale?: string
): string => {
  const i18n = locale ? createLifecycleI18n(locale) : getDefaultI18n();
  const stageMeta = locale
    ? getLocalizedStageMeta(locale)
    : LIFECYCLE_STAGE_META;
  const meta = stageMeta[recommendation.stage];
  const topAction = recommendation.actions[0];
  const actionCopy = topAction
    ? `${topAction.title} (${topAction.estimatedImpact} impact)`
    : i18n.t('formatter.action.fallback');

  return i18n.t('formatter.digest', { name: meta.name, actionCopy });
};

export const getStageLabel = (
  stage: LifecycleStage,
  locale?: string
): string => {
  const stageMeta = locale
    ? getLocalizedStageMeta(locale)
    : LIFECYCLE_STAGE_META;
  return stageMeta[stage].name;
};

export const getStageOrderIndex = (stage: LifecycleStage): number =>
  LIFECYCLE_STAGE_ORDER.indexOf(stage);

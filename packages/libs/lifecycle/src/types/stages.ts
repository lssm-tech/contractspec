import { createLifecycleI18n, getDefaultI18n } from '../i18n/messages';
import type { LifecycleI18n } from '../i18n/messages';

export enum LifecycleStage {
  Exploration = 0,
  ProblemSolutionFit = 1,
  MvpEarlyTraction = 2,
  ProductMarketFit = 3,
  GrowthScaleUp = 4,
  ExpansionPlatform = 5,
  MaturityRenewal = 6,
}

export type LifecycleStageSlug =
  | 'exploration'
  | 'problem-solution-fit'
  | 'mvp-early-traction'
  | 'product-market-fit'
  | 'growth-scale-up'
  | 'expansion-platform'
  | 'maturity-renewal';

export interface LifecycleStageMetadata {
  id: LifecycleStage;
  order: number;
  slug: LifecycleStageSlug;
  name: string;
  question: string;
  signals: string[];
  traps: string[];
  focusAreas: string[];
}

export const LIFECYCLE_STAGE_ORDER: LifecycleStage[] = [
  LifecycleStage.Exploration,
  LifecycleStage.ProblemSolutionFit,
  LifecycleStage.MvpEarlyTraction,
  LifecycleStage.ProductMarketFit,
  LifecycleStage.GrowthScaleUp,
  LifecycleStage.ExpansionPlatform,
  LifecycleStage.MaturityRenewal,
];

/**
 * Stage slug-to-i18n key prefix mapping.
 * Kept internal to avoid coupling callers to key naming conventions.
 */
const STAGE_KEY_PREFIXES: Record<LifecycleStage, string> = {
  [LifecycleStage.Exploration]: 'stage.exploration',
  [LifecycleStage.ProblemSolutionFit]: 'stage.problemSolutionFit',
  [LifecycleStage.MvpEarlyTraction]: 'stage.mvpEarlyTraction',
  [LifecycleStage.ProductMarketFit]: 'stage.productMarketFit',
  [LifecycleStage.GrowthScaleUp]: 'stage.growthScaleUp',
  [LifecycleStage.ExpansionPlatform]: 'stage.expansionPlatform',
  [LifecycleStage.MaturityRenewal]: 'stage.maturityRenewal',
};

/** Number of signal keys per stage */
const SIGNAL_COUNT = 3;
/** Number of focus area keys per stage */
const FOCUS_COUNT = 3;

/**
 * Trap counts per stage (varies by stage).
 */
const TRAP_COUNTS: Record<LifecycleStage, number> = {
  [LifecycleStage.Exploration]: 2,
  [LifecycleStage.ProblemSolutionFit]: 2,
  [LifecycleStage.MvpEarlyTraction]: 2,
  [LifecycleStage.ProductMarketFit]: 2,
  [LifecycleStage.GrowthScaleUp]: 2,
  [LifecycleStage.ExpansionPlatform]: 1,
  [LifecycleStage.MaturityRenewal]: 1,
};

/** Slug mapping for each stage */
const STAGE_SLUGS: Record<LifecycleStage, LifecycleStageSlug> = {
  [LifecycleStage.Exploration]: 'exploration',
  [LifecycleStage.ProblemSolutionFit]: 'problem-solution-fit',
  [LifecycleStage.MvpEarlyTraction]: 'mvp-early-traction',
  [LifecycleStage.ProductMarketFit]: 'product-market-fit',
  [LifecycleStage.GrowthScaleUp]: 'growth-scale-up',
  [LifecycleStage.ExpansionPlatform]: 'expansion-platform',
  [LifecycleStage.MaturityRenewal]: 'maturity-renewal',
};

/**
 * Build stage metadata for a given stage using an i18n instance.
 */
function buildStageMeta(
  stage: LifecycleStage,
  i18n: LifecycleI18n
): LifecycleStageMetadata {
  const prefix = STAGE_KEY_PREFIXES[stage];
  const trapCount = TRAP_COUNTS[stage];

  return {
    id: stage,
    order: stage,
    slug: STAGE_SLUGS[stage],
    name: i18n.t(`${prefix}.name`),
    question: i18n.t(`${prefix}.question`),
    signals: Array.from({ length: SIGNAL_COUNT }, (_, i) =>
      i18n.t(`${prefix}.signal.${i}`)
    ),
    traps: Array.from({ length: trapCount }, (_, i) =>
      i18n.t(`${prefix}.trap.${i}`)
    ),
    focusAreas: Array.from({ length: FOCUS_COUNT }, (_, i) =>
      i18n.t(`${prefix}.focus.${i}`)
    ),
  };
}

/**
 * Get localized lifecycle stage metadata for all stages.
 *
 * @param locale - Optional locale (defaults to "en")
 * @returns Record mapping LifecycleStage to localized LifecycleStageMetadata
 */
export const getLocalizedStageMeta = (
  locale?: string
): Record<LifecycleStage, LifecycleStageMetadata> => {
  const i18n = locale ? createLifecycleI18n(locale) : getDefaultI18n();
  const result = {} as Record<LifecycleStage, LifecycleStageMetadata>;
  for (const stage of LIFECYCLE_STAGE_ORDER) {
    result[stage] = buildStageMeta(stage, i18n);
  }
  return result;
};

/**
 * Static English stage metadata — backward-compatible default.
 *
 * For localized metadata, use `getLocalizedStageMeta(locale)` instead.
 */
export const LIFECYCLE_STAGE_META: Record<
  LifecycleStage,
  LifecycleStageMetadata
> = getLocalizedStageMeta('en');

export const getLifecycleStageBySlug = (
  slug: LifecycleStageSlug
): LifecycleStage => {
  const entry = Object.values(LIFECYCLE_STAGE_META).find(
    (meta) => meta.slug === slug
  );
  if (!entry) {
    throw new Error(`Unknown lifecycle stage slug: ${slug}`);
  }
  return entry.id;
};

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

export const LIFECYCLE_STAGE_META: Record<
  LifecycleStage,
  LifecycleStageMetadata
> = {
  [LifecycleStage.Exploration]: {
    id: LifecycleStage.Exploration,
    order: 0,
    slug: 'exploration',
    name: 'Exploration / Ideation',
    question: 'Is there a problem worth my time?',
    signals: [
      '20+ discovery interviews',
      'Clear problem statement',
      'Named ICP',
    ],
    traps: ['Branding before discovery', 'Premature tooling decisions'],
    focusAreas: ['Customer discovery', 'Problem definition', 'Segment clarity'],
  },
  [LifecycleStage.ProblemSolutionFit]: {
    id: LifecycleStage.ProblemSolutionFit,
    order: 1,
    slug: 'problem-solution-fit',
    name: 'Problem–Solution Fit',
    question: 'Do people care enough about this solution?',
    signals: ['Prototype reuse', 'Referral energy', 'Pre-pay interest'],
    traps: ['“Market is huge” without users', 'Skipping qualitative loops'],
    focusAreas: ['Solution hypothesis', 'Value messaging', 'Feedback capture'],
  },
  [LifecycleStage.MvpEarlyTraction]: {
    id: LifecycleStage.MvpEarlyTraction,
    order: 2,
    slug: 'mvp-early-traction',
    name: 'MVP & Early Traction',
    question: 'Can we get real usage and learn fast?',
    signals: ['20–50 named active users', 'Weekly releases', 'Noisy feedback'],
    traps: ['Overbuilt infra for 10 users', 'Undefined retention metric'],
    focusAreas: ['Activation', 'Cohort tracking', 'Feedback rituals'],
  },
  [LifecycleStage.ProductMarketFit]: {
    id: LifecycleStage.ProductMarketFit,
    order: 3,
    slug: 'product-market-fit',
    name: 'Product–Market Fit',
    question: 'Is this pulling us forward?',
    signals: [
      'Retention without heroics',
      'Organic word-of-mouth',
      'Value stories',
    ],
    traps: ['Hero growth that does not scale', 'Ignoring churn signals'],
    focusAreas: ['Retention', 'Reliability', 'ICP clarity'],
  },
  [LifecycleStage.GrowthScaleUp]: {
    id: LifecycleStage.GrowthScaleUp,
    order: 4,
    slug: 'growth-scale-up',
    name: 'Growth / Scale-up',
    question: 'Can we grow this repeatably?',
    signals: [
      'Predictable channels',
      'Specialized hires',
      'Unit economics on track',
    ],
    traps: [
      'Paid spend masking retention gaps',
      'Infra debt blocking launches',
    ],
    focusAreas: ['Ops systems', 'Growth loops', 'Reliability engineering'],
  },
  [LifecycleStage.ExpansionPlatform]: {
    id: LifecycleStage.ExpansionPlatform,
    order: 5,
    slug: 'expansion-platform',
    name: 'Expansion / Platform',
    question: 'What is the next growth curve?',
    signals: ['Stable core metrics', 'Partner/API demand', 'Ecosystem pull'],
    traps: ['Platform theater before wedge is solid'],
    focusAreas: ['Partnerships', 'APIs', 'New market validation'],
  },
  [LifecycleStage.MaturityRenewal]: {
    id: LifecycleStage.MaturityRenewal,
    order: 6,
    slug: 'maturity-renewal',
    name: 'Maturity / Renewal',
    question: 'Optimize, reinvent, or sunset?',
    signals: ['Margin focus', 'Portfolio bets', 'Narrative refresh'],
    traps: ['Assuming past success is enough'],
    focusAreas: ['Cost optimization', 'Reinvention bets', 'Sunset planning'],
  },
};

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

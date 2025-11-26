import { LifecycleStage } from '@lssm/lib.lifecycle';

export interface LifecycleExperimentTemplate {
  id: string;
  stage: LifecycleStage;
  title: string;
  hypothesis: string;
  primaryMetric: string;
  guardrails: string[];
  rolloutStrategy: 'single-tenant' | 'percentile' | 'holdback';
  recommendedDurationDays: number;
}

const TEMPLATES: LifecycleExperimentTemplate[] = [
  {
    id: 'lifecycle-stage0-problem-signal',
    stage: LifecycleStage.Exploration,
    title: 'Problem Signal Pulse',
    hypothesis:
      'If we share a lightweight storyboard, at least 40% of interviewees will request a follow-up.',
    primaryMetric: 'Follow-up request rate',
    guardrails: ['No automated onboarding', 'Manual review of every response'],
    rolloutStrategy: 'single-tenant',
    recommendedDurationDays: 7,
  },
  {
    id: 'lifecycle-stage1-solution-stickiness',
    stage: LifecycleStage.ProblemSolutionFit,
    title: 'Prototype Stickiness',
    hypothesis: 'Showing a guided replay will increase prototype reuse by 20%.',
    primaryMetric: 'Prototype reuse rate',
    guardrails: [
      'Cap participants to 15 design partners',
      'Manual approval for feature unlocks',
    ],
    rolloutStrategy: 'single-tenant',
    recommendedDurationDays: 10,
  },
  {
    id: 'lifecycle-stage2-onboarding-friction',
    stage: LifecycleStage.MvpEarlyTraction,
    title: 'Onboarding Friction Test',
    hypothesis:
      'Simplifying the registration flow will raise activation by 15%.',
    primaryMetric: 'Activation completion',
    guardrails: ['Do not modify payment flow', 'Enable audit logging'],
    rolloutStrategy: 'percentile',
    recommendedDurationDays: 14,
  },
  {
    id: 'lifecycle-stage3-retention-loop',
    stage: LifecycleStage.ProductMarketFit,
    title: 'Retention Highlight Loop',
    hypothesis:
      'Highlighting win stories inside the product will improve week-4 retention by 5%.',
    primaryMetric: 'Week-4 retention',
    guardrails: [
      'Holdback group for 20% of cohorts',
      'Alert lifecycle team on material drop',
    ],
    rolloutStrategy: 'holdback',
    recommendedDurationDays: 21,
  },
  {
    id: 'lifecycle-stage4-growth-channel',
    stage: LifecycleStage.GrowthScaleUp,
    title: 'Channel Allocation',
    hypothesis:
      'Shifting 10% spend to referral incentives yields higher LTV/CAC.',
    primaryMetric: 'LTV/CAC delta',
    guardrails: [
      'Freeze spend if payback > 6 months',
      'Track infra load per tenant',
    ],
    rolloutStrategy: 'percentile',
    recommendedDurationDays: 28,
  },
  {
    id: 'lifecycle-stage5-platform-integration',
    stage: LifecycleStage.ExpansionPlatform,
    title: 'Partner Integration Pilot',
    hypothesis:
      'Providing pre-built workflows cuts partner onboarding time by 30%.',
    primaryMetric: 'Partner onboarding duration',
    guardrails: [
      'Start with 2 design partners',
      'Manual approvals before general release',
    ],
    rolloutStrategy: 'single-tenant',
    recommendedDurationDays: 30,
  },
  {
    id: 'lifecycle-stage6-renewal-optimization',
    stage: LifecycleStage.MaturityRenewal,
    title: 'Renewal Automation',
    hypothesis: 'Automating renewal nudges reduces churn by 2%.',
    primaryMetric: 'Gross dollar retention',
    guardrails: [
      'Monitor support load impact',
      'Run CFO review before expanding',
    ],
    rolloutStrategy: 'holdback',
    recommendedDurationDays: 35,
  },
];

export const getLifecycleExperimentTemplates = (
  stage: LifecycleStage
): LifecycleExperimentTemplate[] =>
  TEMPLATES.filter((template) => template.stage === stage);

export const listLifecycleExperimentTemplates =
  (): LifecycleExperimentTemplate[] => TEMPLATES;











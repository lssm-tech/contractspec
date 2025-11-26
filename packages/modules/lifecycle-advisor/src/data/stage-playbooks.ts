import type {
  LifecycleAction,
  LifecycleRecommendation,
} from '@lssm/lib.lifecycle';
import { LifecycleStage } from '@lssm/lib.lifecycle';

export interface StagePlaybookData {
  stage: LifecycleStage;
  focusAreas: string[];
  actions: LifecycleAction[];
  ceremony?: LifecycleRecommendation['ceremony'];
}

const stagePlaybooks: StagePlaybookData[] = [
  {
    stage: LifecycleStage.Exploration,
    focusAreas: ['Discovery', 'Problem clarity', 'Persona'],
    actions: [
      {
        id: 'stage0-interview-burst',
        stage: LifecycleStage.Exploration,
        title: 'Run a 5-day interview burst',
        description:
          'Schedule at least 5 back-to-back interviews and capture raw quotes.',
        priority: 1,
        estimatedImpact: 'medium',
        effortLevel: 'm',
        category: 'product',
        recommendedLibraries: ['@lssm/lib.content-gen'],
      },
      {
        id: 'stage0-problem-story',
        stage: LifecycleStage.Exploration,
        title: 'Write the problem story',
        description:
          'Summarize the pain in one paragraph you can repeat to partners.',
        priority: 2,
        estimatedImpact: 'low',
        effortLevel: 's',
        category: 'product',
      },
    ],
    ceremony: {
      title: 'Discovery Spark',
      copy: 'Share the sharpest pain quote with your crew. Frame it, celebrate focus.',
      cues: ['🔎', '🗒️'],
    },
  },
  {
    stage: LifecycleStage.ProblemSolutionFit,
    focusAreas: ['Prototype', 'Feedback', 'Value proof'],
    actions: [
      {
        id: 'stage1-demo-loop',
        stage: LifecycleStage.ProblemSolutionFit,
        title: 'Prototype feedback loop',
        description:
          'Ship a low-fidelity prototype and collect 3 rounds of reactions.',
        priority: 1,
        estimatedImpact: 'medium',
        effortLevel: 'm',
        category: 'product',
        recommendedLibraries: ['@lssm/lib.progressive-delivery'],
      },
      {
        id: 'stage1-referrals',
        stage: LifecycleStage.ProblemSolutionFit,
        title: 'Capture referral signals',
        description: 'Ask each tester who else should see the demo.',
        priority: 2,
        estimatedImpact: 'low',
        effortLevel: 's',
        category: 'growth',
      },
    ],
    ceremony: {
      title: 'Solution Resonance',
      copy: 'Record a short screen share telling the before/after story to your future self.',
      cues: ['🎤', '✨'],
    },
  },
  {
    stage: LifecycleStage.MvpEarlyTraction,
    focusAreas: ['Activation', 'Telemetry', 'Feedback'],
    actions: [
      {
        id: 'stage2-activation',
        stage: LifecycleStage.MvpEarlyTraction,
        title: 'Define activation checklist',
        description: 'Document the 3 steps users must finish to get value.',
        priority: 1,
        estimatedImpact: 'high',
        effortLevel: 'm',
        category: 'operations',
        recommendedLibraries: ['@lssm/lib.analytics', '@lssm/lib.observability'],
      },
      {
        id: 'stage2-weekly-sync',
        stage: LifecycleStage.MvpEarlyTraction,
        title: 'Weekly user sync',
        description: 'Host a standing call with your 5 most active testers.',
        priority: 2,
        estimatedImpact: 'medium',
        effortLevel: 'm',
        category: 'company',
      },
    ],
    ceremony: {
      title: 'Traction Toast',
      copy: 'Toast your first 20 real users—say their names, tell them why they matter.',
      cues: ['🥂', '📣'],
    },
  },
  {
    stage: LifecycleStage.ProductMarketFit,
    focusAreas: ['Retention', 'Reliability', 'Story'],
    actions: [
      {
        id: 'stage3-retention-study',
        stage: LifecycleStage.ProductMarketFit,
        title: 'Run a retention study',
        description:
          'Interview 3 retained users and publish their before/after metrics.',
        priority: 1,
        estimatedImpact: 'high',
        effortLevel: 'm',
        category: 'product',
        recommendedLibraries: ['@lssm/lib.evolution'],
      },
      {
        id: 'stage3-incident-review',
        stage: LifecycleStage.ProductMarketFit,
        title: 'Lightweight incident review',
        description:
          'Review the last 2 reliability hiccups and capture fixes.',
        priority: 2,
        estimatedImpact: 'medium',
        effortLevel: 's',
        category: 'operations',
      },
    ],
    ceremony: {
      title: 'PMF Signal Fire',
      copy: 'Write a letter to your future Series A self describing the pull you feel today.',
      cues: ['🔥', '📬'],
    },
  },
  {
    stage: LifecycleStage.GrowthScaleUp,
    focusAreas: ['Systems', 'Growth loops', 'Specialization'],
    actions: [
      {
        id: 'stage4-growth-loop',
        stage: LifecycleStage.GrowthScaleUp,
        title: 'Codify a growth loop',
        description:
          'Choose one loop (SEO, referrals, outbound) and document owners + inputs.',
        priority: 1,
        estimatedImpact: 'high',
        effortLevel: 'l',
        category: 'growth',
        recommendedLibraries: ['@lssm/lib.growth', '@lssm/lib.resilience'],
      },
      {
        id: 'stage4-hiring-map',
        stage: LifecycleStage.GrowthScaleUp,
        title: 'Create hiring map',
        description:
          'List specialized roles you need in the next 2 quarters.',
        priority: 2,
        estimatedImpact: 'medium',
        effortLevel: 'm',
        category: 'company',
      },
    ],
    ceremony: {
      title: 'Scale Systems',
      copy: 'Invite the team to map the journey from first user to repeatable machine.',
      cues: ['🗺️', '⚙️'],
    },
  },
  {
    stage: LifecycleStage.ExpansionPlatform,
    focusAreas: ['Partners', 'APIs', 'Expansion bets'],
    actions: [
      {
        id: 'stage5-partner-brief',
        stage: LifecycleStage.ExpansionPlatform,
        title: 'Partner readiness brief',
        description:
          'Document partner types, value props, and onboarding steps.',
        priority: 1,
        estimatedImpact: 'high',
        effortLevel: 'm',
        category: 'product',
        recommendedLibraries: ['@lssm/lib.workflow-composer'],
      },
      {
        id: 'stage5-experiment-portfolio',
        stage: LifecycleStage.ExpansionPlatform,
        title: 'Expansion experiment portfolio',
        description:
          'List the top 3 markets or product lines with owners.',
        priority: 2,
        estimatedImpact: 'medium',
        effortLevel: 'm',
        category: 'growth',
      },
    ],
    ceremony: {
      title: 'Platform Threshold',
      copy: 'Host a partner circle—invite allies to share what they need from your platform.',
      cues: ['🤝', '🌐'],
    },
  },
  {
    stage: LifecycleStage.MaturityRenewal,
    focusAreas: ['Optimization', 'Renewal', 'Portfolio'],
    actions: [
      {
        id: 'stage6-cost-review',
        stage: LifecycleStage.MaturityRenewal,
        title: 'Run a cost-to-value review',
        description: 'Audit each major surface for margin impact.',
        priority: 1,
        estimatedImpact: 'high',
        effortLevel: 'm',
        category: 'operations',
        recommendedLibraries: ['@lssm/lib.cost-tracking'],
      },
      {
        id: 'stage6-renewal-bet',
        stage: LifecycleStage.MaturityRenewal,
        title: 'Define the renewal bet',
        description:
          'Choose one reinvention or sunset track and set checkpoints.',
        priority: 2,
        estimatedImpact: 'medium',
        effortLevel: 'm',
        category: 'product',
      },
    ],
    ceremony: {
      title: 'Renewal Summit',
      copy: 'Pause to honor what got you here, then commit publicly to the next reinvention.',
      cues: ['🏔️', '🔁'],
    },
  },
];

export default stagePlaybooks;





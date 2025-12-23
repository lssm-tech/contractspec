import type { LifecycleStage } from '@lssm/lib.lifecycle';
import type { LibraryRecommendation } from '../recommendations/library-recommender';

export interface LibraryStageEntry {
  stage: LifecycleStage;
  items: LibraryRecommendation[];
}

const libraryStageMap: LibraryStageEntry[] = [
  {
    stage: 0 as LifecycleStage,
    items: [
      {
        id: '@lssm/lib.content-gen',
        type: 'library',
        description: 'Summarize interviews and synthesize IC insights.',
      },
      {
        id: '@lssm/lib.presentation-runtime',
        type: 'library',
        description: 'Craft low-fi storyboards without custom code.',
      },
    ],
  },
  {
    stage: 1 as LifecycleStage,
    items: [
      {
        id: '@lssm/lib.progressive-delivery',
        type: 'library',
        description: 'Gate prototype features behind lightweight flags.',
      },
      {
        id: '@lssm/module.lifecycle-core',
        type: 'module',
        description: 'Capture questionnaire signals for early scoring.',
      },
    ],
  },
  {
    stage: 2 as LifecycleStage,
    items: [
      {
        id: '@lssm/lib.analytics',
        type: 'library',
        description: 'Instrument activation paths + cohorts.',
      },
      {
        id: '@lssm/lib.observability',
        type: 'library',
        description: 'Collect minimum viable traces and metrics.',
      },
    ],
  },
  {
    stage: 3 as LifecycleStage,
    items: [
      {
        id: '@lssm/lib.evolution',
        type: 'library',
        description: 'Auto-detect contract gaps and spec improvements.',
      },
      {
        id: '@lssm/module.lifecycle-advisor',
        type: 'module',
        description: 'Generate retention-focused guidance at scale.',
      },
    ],
  },
  {
    stage: 4 as LifecycleStage,
    items: [
      {
        id: '@lssm/lib.growth',
        type: 'library',
        description: 'Experiment orchestration with guardrails.',
      },
      {
        id: '@lssm/lib.resilience',
        type: 'library',
        description: 'Stabilize infra and SLOs as teams split.',
      },
    ],
  },
  {
    stage: 5 as LifecycleStage,
    items: [
      {
        id: '@lssm/lib.workflow-composer',
        type: 'library',
        description: 'Automate partner workflows and integrations.',
      },
      {
        id: '@lssm/bundle.contractspec-studio',
        type: 'bundle',
        description: 'Expose managed partner onboarding via Studio.',
      },
    ],
  },
  {
    stage: 6 as LifecycleStage,
    items: [
      {
        id: '@lssm/lib.cost-tracking',
        type: 'library',
        description: 'Model margin scenarios and reinvestment bets.',
      },
      {
        id: '@lssm/lib.workflow-composer',
        type: 'library',
        description: 'Standardize renewal rituals and automation.',
      },
    ],
  },
];

export default libraryStageMap;

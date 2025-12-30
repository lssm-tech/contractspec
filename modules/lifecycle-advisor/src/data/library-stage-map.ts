import type { LifecycleStage } from '@contractspec/lib.lifecycle';
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
        id: '@contractspec/lib.content-gen',
        type: 'library',
        description: 'Summarize interviews and synthesize IC insights.',
      },
      {
        id: '@contractspec/lib.presentation-runtime',
        type: 'library',
        description: 'Craft low-fi storyboards without custom code.',
      },
    ],
  },
  {
    stage: 1 as LifecycleStage,
    items: [
      {
        id: '@contractspec/lib.progressive-delivery',
        type: 'library',
        description: 'Gate prototype features behind lightweight flags.',
      },
      {
        id: '@contractspec/module.lifecycle-core',
        type: 'module',
        description: 'Capture questionnaire signals for early scoring.',
      },
    ],
  },
  {
    stage: 2 as LifecycleStage,
    items: [
      {
        id: '@contractspec/lib.analytics',
        type: 'library',
        description: 'Instrument activation paths + cohorts.',
      },
      {
        id: '@contractspec/lib.observability',
        type: 'library',
        description: 'Collect minimum viable traces and metrics.',
      },
    ],
  },
  {
    stage: 3 as LifecycleStage,
    items: [
      {
        id: '@contractspec/lib.evolution',
        type: 'library',
        description: 'Auto-detect contract gaps and spec improvements.',
      },
      {
        id: '@contractspec/module.lifecycle-advisor',
        type: 'module',
        description: 'Generate retention-focused guidance at scale.',
      },
    ],
  },
  {
    stage: 4 as LifecycleStage,
    items: [
      {
        id: '@contractspec/lib.growth',
        type: 'library',
        description: 'Experiment orchestration with guardrails.',
      },
      {
        id: '@contractspec/lib.resilience',
        type: 'library',
        description: 'Stabilize infra and SLOs as teams split.',
      },
    ],
  },
  {
    stage: 5 as LifecycleStage,
    items: [
      {
        id: '@contractspec/lib.workflow-composer',
        type: 'library',
        description: 'Automate partner workflows and integrations.',
      },
      {
        id: '@contractspec/bundle.studio',
        type: 'bundle',
        description: 'Expose managed partner onboarding via Studio.',
      },
    ],
  },
  {
    stage: 6 as LifecycleStage,
    items: [
      {
        id: '@contractspec/lib.cost-tracking',
        type: 'library',
        description: 'Model margin scenarios and reinvestment bets.',
      },
      {
        id: '@contractspec/lib.workflow-composer',
        type: 'library',
        description: 'Standardize renewal rituals and automation.',
      },
    ],
  },
];

export default libraryStageMap;

import { defineCapability, StabilityEnum } from '@lssm/lib.contracts';

const OWNERS = ['platform.contractspec-studio'] as const;

export const LifecycleAssessmentCapability = defineCapability({
  meta: {
    key: 'studio.lifecycle.assessment',
    version: 1,
    kind: 'api',
    title: 'Lifecycle Assessment Service',
    description:
      'Collect signals, run lifecycle assessments, and surface recommendations or milestone progress.',
    domain: 'lifecycle',
    owners: [...OWNERS],
    tags: ['lifecycle', 'assessment', 'recommendations'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      name: 'studio.lifecycle.assessment.run',
      version: 1,
      description: 'Run a full lifecycle assessment for an organization.',
    },
    {
      surface: 'operation',
      name: 'studio.lifecycle.recommendations.get',
      version: 1,
      description: 'Retrieve actionable lifecycle recommendations.',
    },
    {
      surface: 'operation',
      name: 'studio.lifecycle.milestone.track',
      version: 1,
      description: 'Track milestone progress and ceremonial transitions.',
    },
  ],
  requires: [{ key: 'studio.project', version: 1 }],
});



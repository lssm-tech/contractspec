import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

const OWNERS = ['platform.contractspec-studio'] as const;

export const LifecycleAssessmentCapability = defineCapability({
  meta: {
    key: 'studio.lifecycle.assessment',
    version: '1.0.0',
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
      key: 'studio.lifecycle.assessment.run',
      version: '1.0.0',
      description: 'Run a full lifecycle assessment for an organization.',
    },
    {
      surface: 'operation',
      key: 'studio.lifecycle.recommendations.get',
      version: '1.0.0',
      description: 'Retrieve actionable lifecycle recommendations.',
    },
    {
      surface: 'operation',
      key: 'studio.lifecycle.milestone.track',
      version: '1.0.0',
      description: 'Track milestone progress and ceremonial transitions.',
    },
  ],
  requires: [{ key: 'studio.project', version: '1.0.0' }],
});

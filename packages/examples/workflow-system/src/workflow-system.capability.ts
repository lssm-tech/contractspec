import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const WorkflowCapability = defineCapability({
  meta: {
    key: 'workflow',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Workflow definitions and orchestration',
    owners: ['platform.core'],
    tags: ['workflow', 'automation'],
  },
});

export const ApprovalCapability = defineCapability({
  meta: {
    key: 'approval',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Approval workflows and user decisions',
    owners: ['platform.core'],
    tags: ['approval', 'workflow'],
  },
});

export const StateMachineCapability = defineCapability({
  meta: {
    key: 'state-machine',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'State machine orchestration and transitions',
    owners: ['platform.core'],
    tags: ['state-machine', 'workflow'],
  },
});

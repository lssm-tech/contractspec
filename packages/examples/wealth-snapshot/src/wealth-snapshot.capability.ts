import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const AccountsCapability = defineCapability({
  meta: {
    key: 'accounts',
    version: '1.0.0',
    kind: 'data',
    stability: StabilityEnum.Experimental,
    description: 'Financial accounts tracking and aggregation',
    owners: ['platform.finance'],
    tags: ['accounts', 'finance', 'wealth'],
  },
});

export const NetWorthCapability = defineCapability({
  meta: {
    key: 'net-worth',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Net worth visualization and tracking',
    owners: ['platform.finance'],
    tags: ['net-worth', 'wealth', 'dashboard'],
  },
});

export const GoalsCapability = defineCapability({
  meta: {
    key: 'goals',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Financial goal setting and progress tracking',
    owners: ['platform.finance'],
    tags: ['goals', 'planning', 'wealth'],
  },
});

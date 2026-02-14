import {
  defineCapability,
  StabilityEnum,
} from '@contractspec/lib.contracts-spec';

export const IntegrationCapability = defineCapability({
  meta: {
    key: 'integration',
    version: '1.0.0',
    kind: 'integration',
    stability: StabilityEnum.Experimental,
    description: 'Third-party integration connections',
    owners: ['platform.core'],
    tags: ['integration', 'connections'],
  },
});

export const SyncCapability = defineCapability({
  meta: {
    key: 'sync',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Data synchronization between systems',
    owners: ['platform.core'],
    tags: ['sync', 'data'],
  },
});

export const EtlCapability = defineCapability({
  meta: {
    key: 'etl',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Extract, transform, load data pipelines',
    owners: ['platform.core'],
    tags: ['etl', 'data', 'pipeline'],
  },
});

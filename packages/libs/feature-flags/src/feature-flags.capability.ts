import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const FeatureFlagsCapability = defineCapability({
  meta: {
    key: 'feature-flag',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Feature flag management and evaluation',
    owners: ['@platform.featureflags'],
    tags: ['feature-flags', 'configuration'],
  },
});

export const ExperimentsCapability = defineCapability({
  meta: {
    key: 'experiments',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'A/B testing and experimentation platform',
    owners: ['@platform.featureflags'],
    tags: ['experiments', 'ab-testing'],
  },
});

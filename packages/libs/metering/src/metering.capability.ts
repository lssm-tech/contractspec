import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts-spec';

export const MeteringCapability = defineCapability({
  meta: {
    key: 'metering',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Usage metering and tracking',
    owners: ['@platform.finance'],
    tags: ['metering', 'usage', 'billing'],
  },
});

export const ThresholdsCapability = defineCapability({
  meta: {
    key: 'thresholds',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Usage threshold alerts and limits',
    owners: ['@platform.finance'],
    tags: ['thresholds', 'limits', 'metering'],
  },
});

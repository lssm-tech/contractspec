import { defineCapability } from '@contractspec/lib.contracts-spec/capabilities';
import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';

export const HealthCapability = defineCapability({
  meta: {
    key: 'health',
    version: '1.0.0',
    kind: 'integration',
    stability: StabilityEnum.Experimental,
    description: 'Wearables and health data integrations capability.',
    owners: ['@platform.integrations'],
    tags: ['health', 'wearables', 'integrations'],
  },
});

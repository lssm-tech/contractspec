import { defineCapability } from '@contractspec/lib.contracts-spec/capabilities';
import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';

export const IntegrationsCapability = defineCapability({
  meta: {
    key: 'integrations',
    version: '1.0.0',
    kind: 'integration',
    stability: StabilityEnum.Experimental,
    description: 'Core integrations capability for third-party connections',
    owners: ['@platform.core'],
    tags: ['integrations', 'platform'],
  },
});

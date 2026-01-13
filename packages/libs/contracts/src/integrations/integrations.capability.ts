import { defineCapability } from '../capabilities';
import { StabilityEnum } from '../ownership';

export const IntegrationsCapability = defineCapability({
  meta: {
    key: 'integrations',
    version: '1.0.0',
    kind: 'integration',
    stability: StabilityEnum.Experimental,
    description: 'Core integrations capability for third-party connections',
    owners: ['platform.core'],
    tags: ['integrations', 'platform'],
  },
});

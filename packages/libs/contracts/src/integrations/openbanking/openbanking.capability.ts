import { defineCapability } from '../../capabilities';
import { StabilityEnum } from '../../ownership';

export const OpenBankingCapability = defineCapability({
  meta: {
    key: 'openbanking',
    version: '1.0.0',
    kind: 'integration',
    stability: StabilityEnum.Experimental,
    description: 'Open Banking integrations capability',
    owners: ['@platform.finance'],
    tags: ['openbanking', 'finance', 'integrations'],
  },
});

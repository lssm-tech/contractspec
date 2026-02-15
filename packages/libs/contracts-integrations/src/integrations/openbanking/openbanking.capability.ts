import { defineCapability } from '@contractspec/lib.contracts-spec/capabilities';
import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';

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

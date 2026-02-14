import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts-spec';

export const PocketFamilyOfficeCapability = defineCapability({
  meta: {
    key: 'pocket-family-office',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Personal family office management',
    owners: ['@platform.finance'],
    tags: ['family-office', 'wealth', 'personal'],
  },
});

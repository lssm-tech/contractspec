import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const AuditTrailCapability = defineCapability({
  meta: {
    key: 'audit-trail',
    version: '1.0.0',
    kind: 'data',
    stability: StabilityEnum.Experimental,
    description: 'Audit logging and compliance tracking',
    owners: ['@platform.core'],
    tags: ['audit', 'logging', 'compliance'],
  },
});

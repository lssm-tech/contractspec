import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const QuotesCapability = defineCapability({
  meta: {
    key: 'quotes',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Quote generation and management for service businesses',
    owners: ['platform.core'],
    tags: ['quotes', 'service', 'business'],
  },
});

export const InvoicesCapability = defineCapability({
  meta: {
    key: 'invoices',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'Invoice creation and payment tracking',
    owners: ['platform.finance'],
    tags: ['invoices', 'billing'],
  },
});

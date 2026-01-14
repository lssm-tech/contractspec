import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const MarketplaceCapability = defineCapability({
  meta: {
    key: 'marketplace',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Multi-vendor marketplace platform',
    owners: ['platform.marketplace'],
    tags: ['marketplace', 'ecommerce'],
  },
});

export const EcommerceCapability = defineCapability({
  meta: {
    key: 'ecommerce',
    version: '1.0.0',
    kind: 'api',
    stability: StabilityEnum.Experimental,
    description: 'E-commerce operations and product catalog',
    owners: ['platform.marketplace'],
    tags: ['ecommerce', 'products'],
  },
});

export const PaymentsCapability = defineCapability({
  meta: {
    key: 'payments',
    version: '1.0.0',
    kind: 'integration',
    stability: StabilityEnum.Experimental,
    description: 'Payment processing and payouts',
    owners: ['platform.finance'],
    tags: ['payments', 'finance'],
  },
});

import type { AppBlueprintSpec } from '@lssm/lib.contracts/app-config/spec';
import { OwnersEnum, StabilityEnum, TagsEnum } from '@lssm/lib.contracts/ownership';

export const artisanStripeBlueprint: AppBlueprintSpec = {
  meta: {
    name: 'artisan.payments.stripe',
    version: 1,
    appId: 'artisan',
    title: 'ArtisanOS Stripe Payments',
    description:
      'Blueprint enabling card payments for ArtisanOS merchants via the Stripe integration.',
    domain: 'payments',
    owners: [OwnersEnum.ProductArtisanos],
    tags: [TagsEnum.Marketplace, 'stripe', 'payments'],
    stability: StabilityEnum.Experimental,
  },
  capabilities: {
    enabled: [{ key: 'payments.psp', version: 1 }],
  },
  workflows: {
    collectPayment: { name: 'artisan.payments.collectPayment', version: 1 },
  },
  policies: [{ name: 'artisan.payments.default', version: 1 }],
  notes:
    'Install this blueprint and pair it with the Stripe integration connection to enable card collection.',
};


import type { AppBlueprintSpec } from '@lssm/lib.contracts/app-config/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@lssm/lib.contracts/ownership';

export const artisanStripeBlueprint: AppBlueprintSpec = {
  meta: {
    name: 'artisan.payments.stripe',
    version: 1,
    appId: 'artisan',
    title: 'ArtisanOS Stripe Payments',
    description:
      'Blueprint enabling card payments for ArtisanOS merchants via the Stripe integration.',
    domain: 'payments',
    owners: [OwnersEnum.PlatformCore],
    tags: [TagsEnum.Marketplace, 'stripe', 'payments'],
    stability: StabilityEnum.Experimental,
  },
  capabilities: {
    enabled: [{ key: 'payments.psp', version: 1 }],
  },
  integrationSlots: [
    {
      slotId: 'primary-payments',
      requiredCategory: 'payments',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [{ key: 'payments.psp', version: 1 }],
      required: true,
      description:
        'Primary card processor slot. Bind the tenant Stripe connection here.',
    },
  ],
  branding: {
    appNameKey: 'artisan.payments.appName',
    assets: [
      { type: 'logo', url: 'https://cdn.artisanos.dev/branding/logo.png' },
      {
        type: 'favicon',
        url: 'https://cdn.artisanos.dev/branding/favicon.ico',
      },
    ],
    colorTokens: {
      primary: 'colors.brand.primary',
      secondary: 'colors.brand.secondary',
    },
  },
  translationCatalog: {
    name: 'artisan.payments.catalog',
    version: 1,
  },
  workflows: {
    collectPayment: { name: 'artisan.payments.collectPayment', version: 1 },
  },
  policies: [{ name: 'artisan.payments.default', version: 1 }],
  notes:
    'Install this blueprint and pair it with the Stripe integration connection to enable card collection.',
};

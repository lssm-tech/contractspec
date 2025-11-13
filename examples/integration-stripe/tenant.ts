import type { TenantAppConfig } from '@lssm/lib.contracts/app-config/spec';

export const artisanStripeTenantConfig: TenantAppConfig = {
  meta: {
    id: 'tenant-config-artisan-stripe',
    tenantId: 'artisan-co',
    appId: 'artisan',
    blueprintName: 'artisan.payments.stripe',
    blueprintVersion: 1,
    environment: 'production',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  integrations: [
    {
      slotId: 'primary-payments',
      connectionId: 'conn-stripe-live',
      scope: {
        workflows: ['collectPayment'],
        operations: ['payments.stripe.chargeCard'],
      },
    },
  ],
  knowledge: [],
  locales: {
    defaultLocale: 'en',
    enabledLocales: ['en', 'es'],
  },
  translationOverrides: {
    entries: [
      {
        key: 'artisan.payments.appName',
        locale: 'en',
        value: 'Artisan Payments Portal',
      },
    ],
  },
  branding: {
    appName: { en: 'Artisan Payments Portal' },
    assets: [
      { type: 'logo', url: 'https://tenant.artisanos.dev/logo.png' },
      { type: 'logo-dark', url: 'https://tenant.artisanos.dev/logo-dark.png' },
    ],
    colors: {
      primary: '#F97316',
      secondary: '#1F2937',
    },
    customDomain: 'pay.artisanos.dev',
  },
  notes: 'Stripe connection bound for production payments.',
};


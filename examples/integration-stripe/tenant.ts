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
      connectionId: 'conn-stripe-live',
      satisfiesCapabilities: [{ key: 'payments.psp', version: 1 }],
      scope: {
        workflows: ['collectPayment'],
        operations: ['payments.stripe.chargeCard'],
      },
    },
  ],
  knowledge: [],
  notes: 'Stripe connection bound for production payments.',
};


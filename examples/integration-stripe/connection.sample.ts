import type { IntegrationConnection } from '@lssm/lib.contracts/integrations/connection';

export const stripeLiveConnection: IntegrationConnection = {
  meta: {
    id: 'conn-stripe-live',
    tenantId: 'artisan-co',
    integrationKey: 'payments.stripe',
    integrationVersion: 1,
    label: 'Stripe Production',
    environment: 'production',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  config: {
    apiKey: 'sk_live_xxx',
    webhookSecret: 'whsec_xxx',
    accountId: 'acct_xxx',
  },
  status: 'active',
};


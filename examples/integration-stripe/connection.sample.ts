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
  ownershipMode: 'managed',
  config: {
    accountId: 'acct_xxx',
  },
  secretRef: 'vault://integrations/artisan-co/conn-stripe-live',
  status: 'active',
};


import type { IntegrationConnection } from '@contractspec/lib.contracts-integrations';
import { StripePaymentsIntegrationSpec } from './integration';

export const stripeLiveConnection: IntegrationConnection = {
	meta: {
		id: 'conn-stripe-live',
		tenantId: 'artisan-co',
		integrationKey: StripePaymentsIntegrationSpec.meta.key,
		integrationVersion: StripePaymentsIntegrationSpec.meta.version,
		label: 'Stripe Production',
		environment: 'production',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
	},
	ownershipMode: 'managed',
	config: {
		accountId: 'acct_xxx',
	},
	secretProvider: 'vault',
	secretRef: 'vault://integrations/artisan-co/conn-stripe-live',
	status: 'connected',
};

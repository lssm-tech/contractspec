import { defineFeature } from '@contractspec/lib.contracts-spec';
import { StripePaymentsIntegrationSpec } from './integration';
import { collectPaymentWorkflow } from './workflow';

export const IntegrationStripeFeature = defineFeature({
	meta: {
		key: 'integration-stripe',
		version: '1.0.0',
		title: 'Stripe Payments Integration',
		description:
			'Stripe payments integration with blueprint, workflow, and tenant configuration',
		domain: 'integration',
		owners: ['@integration-team'],
		tags: ['integration', 'stripe', 'payments'],
		stability: 'experimental',
	},

	integrations: [
		{
			key: StripePaymentsIntegrationSpec.meta.key,
			version: StripePaymentsIntegrationSpec.meta.version,
		},
	],

	workflows: [
		{
			key: collectPaymentWorkflow.meta.key,
			version: collectPaymentWorkflow.meta.version,
		},
	],

	docs: [
		'docs.examples.integration-stripe',
		'docs.examples.integration-stripe.usage',
	],
});

import { defineIntegration } from '@contractspec/lib.contracts-spec/integrations/spec';
import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const StripeConfigModel = defineSchemaModel({
	name: 'StripePaymentsIntegrationConfig',
	description: 'Managed configuration required to connect a Stripe account.',
	fields: {
		accountId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		webhookEndpoint: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
	},
});

const StripeSecretModel = defineSchemaModel({
	name: 'StripePaymentsIntegrationSecret',
	description: 'Secret material stored out-of-band for the Stripe provider.',
	fields: {
		apiKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		webhookSecret: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: false,
		},
	},
});

export const StripePaymentsIntegrationSpec = defineIntegration({
	meta: {
		key: 'integration-stripe.integration.psp',
		version: '1.0.0',
		title: 'Stripe Payments Integration',
		description:
			'Integration contract for managed or BYOK Stripe card processing.',
		domain: 'payments',
		category: 'payments',
		owners: [OwnersEnum.PlatformCore],
		tags: [TagsEnum.Marketplace, 'stripe', 'payments'],
		stability: StabilityEnum.Experimental,
	},
	supportedModes: ['managed', 'byok'],
	capabilities: {
		provides: [{ key: 'payments.psp', version: '1.0.0' }],
	},
	configSchema: {
		schema: StripeConfigModel,
		example: {
			accountId: 'acct_demo_artisan',
			webhookEndpoint: 'https://pay.artisanos.dev/webhooks/stripe',
		},
	},
	secretSchema: {
		schema: StripeSecretModel,
		example: {
			apiKey: 'sk_live_redacted',
			webhookSecret: 'whsec_redacted',
		},
	},
	healthCheck: {
		method: 'ping',
		timeoutMs: 5000,
	},
	docsUrl: 'https://docs.stripe.com',
	constraints: {
		rateLimit: {
			rpm: 1000,
		},
	},
	byokSetup: {
		setupInstructions:
			'Create a restricted API key and webhook endpoint, then bind the secret reference to the tenant connection.',
		requiredScopes: ['charges:write', 'customers:read', 'webhooks:write'],
	},
});

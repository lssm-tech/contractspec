import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ProvidersImplsIntegrationSpecConfig = defineSchemaModel({
	name: 'ProvidersImplsIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.providers-impls.',
	fields: {},
});

const ProvidersImplsIntegrationSpecSecrets = defineSchemaModel({
	name: 'ProvidersImplsIntegrationSecret',
	description: 'Secret material for @contractspec/integration.providers-impls.',
	fields: {},
});

export const ProvidersImplsIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.providers-impls',
			version: '1.0.0',
			title: 'Providers Impls',
			description:
				'Integration provider implementations for email, payments, storage, and more',
			domain: 'providers-impls',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'providers-impls'],
			stability: 'experimental',
		},
		category: 'custom',
	},
	supportedModes: ['managed'],
	capabilities: {
		provides: [
			// Add capability refs here
		],
	},
	configSchema: { schema: ProvidersImplsIntegrationSpecConfig, example: {} },
	secretSchema: { schema: ProvidersImplsIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

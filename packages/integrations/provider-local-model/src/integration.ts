import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ProviderLocalModelIntegrationSpecConfig = defineSchemaModel({
	name: 'ProviderLocalModelIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.provider.local-model.',
	fields: {},
});

const ProviderLocalModelIntegrationSpecSecrets = defineSchemaModel({
	name: 'ProviderLocalModelIntegrationSecret',
	description:
		'Secret material for @contractspec/integration.provider.local-model.',
	fields: {},
});

export const ProviderLocalModelIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.provider-local-model',
			version: '1.0.0',
			title: 'Provider Local Model',
			description: 'Local model provider compatibility wrapper for Builder.',
			domain: 'provider-local-model',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'provider-local-model'],
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
	configSchema: {
		schema: ProviderLocalModelIntegrationSpecConfig,
		example: {},
	},
	secretSchema: {
		schema: ProviderLocalModelIntegrationSpecSecrets,
		example: {},
	},
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

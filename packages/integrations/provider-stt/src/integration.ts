import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ProviderSttIntegrationSpecConfig = defineSchemaModel({
	name: 'ProviderSttIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.provider.stt.',
	fields: {},
});

const ProviderSttIntegrationSpecSecrets = defineSchemaModel({
	name: 'ProviderSttIntegrationSecret',
	description: 'Secret material for @contractspec/integration.provider.stt.',
	fields: {},
});

export const ProviderSttIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.provider-stt',
			version: '1.0.0',
			title: 'Provider Stt',
			description: 'Speech-to-text provider compatibility wrapper for Builder.',
			domain: 'provider-stt',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'provider-stt'],
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
	configSchema: { schema: ProviderSttIntegrationSpecConfig, example: {} },
	secretSchema: { schema: ProviderSttIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

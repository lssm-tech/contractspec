import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ProviderGeminiIntegrationSpecConfig = defineSchemaModel({
	name: 'ProviderGeminiIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.provider.gemini.',
	fields: {},
});

const ProviderGeminiIntegrationSpecSecrets = defineSchemaModel({
	name: 'ProviderGeminiIntegrationSecret',
	description: 'Secret material for @contractspec/integration.provider.gemini.',
	fields: {},
});

export const ProviderGeminiIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.provider-gemini',
			version: '1.0.0',
			title: 'Provider Gemini',
			description: 'Gemini provider compatibility wrapper for Builder.',
			domain: 'provider-gemini',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'provider-gemini'],
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
	configSchema: { schema: ProviderGeminiIntegrationSpecConfig, example: {} },
	secretSchema: { schema: ProviderGeminiIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ProviderCopilotIntegrationSpecConfig = defineSchemaModel({
	name: 'ProviderCopilotIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.provider.copilot.',
	fields: {},
});

const ProviderCopilotIntegrationSpecSecrets = defineSchemaModel({
	name: 'ProviderCopilotIntegrationSecret',
	description:
		'Secret material for @contractspec/integration.provider.copilot.',
	fields: {},
});

export const ProviderCopilotIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.provider-copilot',
			version: '1.0.0',
			title: 'Provider Copilot',
			description: 'Copilot provider compatibility wrapper for Builder.',
			domain: 'provider-copilot',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'provider-copilot'],
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
	configSchema: { schema: ProviderCopilotIntegrationSpecConfig, example: {} },
	secretSchema: { schema: ProviderCopilotIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ProviderCodexIntegrationSpecConfig = defineSchemaModel({
	name: 'ProviderCodexIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.provider.codex.',
	fields: {},
});

const ProviderCodexIntegrationSpecSecrets = defineSchemaModel({
	name: 'ProviderCodexIntegrationSecret',
	description: 'Secret material for @contractspec/integration.provider.codex.',
	fields: {},
});

export const ProviderCodexIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.provider-codex',
			version: '1.0.0',
			title: 'Provider Codex',
			description: 'Codex provider compatibility wrapper for Builder.',
			domain: 'provider-codex',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'provider-codex'],
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
	configSchema: { schema: ProviderCodexIntegrationSpecConfig, example: {} },
	secretSchema: { schema: ProviderCodexIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

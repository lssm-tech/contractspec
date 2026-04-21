import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ProviderClaudeCodeIntegrationSpecConfig = defineSchemaModel({
	name: 'ProviderClaudeCodeIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.provider.claude-code.',
	fields: {},
});

const ProviderClaudeCodeIntegrationSpecSecrets = defineSchemaModel({
	name: 'ProviderClaudeCodeIntegrationSecret',
	description:
		'Secret material for @contractspec/integration.provider.claude-code.',
	fields: {},
});

export const ProviderClaudeCodeIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.provider-claude-code',
			version: '1.0.0',
			title: 'Provider Claude Code',
			description: 'Claude Code provider compatibility wrapper for Builder.',
			domain: 'provider-claude-code',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'provider-claude-code'],
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
		schema: ProviderClaudeCodeIntegrationSpecConfig,
		example: {},
	},
	secretSchema: {
		schema: ProviderClaudeCodeIntegrationSpecSecrets,
		example: {},
	},
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

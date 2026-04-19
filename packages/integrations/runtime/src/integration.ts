import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const RuntimeIntegrationSpecConfig = defineSchemaModel({
	name: 'RuntimeIntegrationConfig',
	description: 'Managed configuration for @contractspec/integration.runtime.',
	fields: {},
});

const RuntimeIntegrationSpecSecrets = defineSchemaModel({
	name: 'RuntimeIntegrationSecret',
	description: 'Secret material for @contractspec/integration.runtime.',
	fields: {},
});

export const RuntimeIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.runtime',
			version: '1.0.0',
			title: 'Runtime',
			description: 'Runtime integration with secret management',
			domain: 'runtime',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'runtime'],
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
	configSchema: { schema: RuntimeIntegrationSpecConfig, example: {} },
	secretSchema: { schema: RuntimeIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

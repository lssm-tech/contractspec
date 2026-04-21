import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const RuntimeLocalIntegrationSpecConfig = defineSchemaModel({
	name: 'RuntimeLocalIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.runtime.local.',
	fields: {},
});

const RuntimeLocalIntegrationSpecSecrets = defineSchemaModel({
	name: 'RuntimeLocalIntegrationSecret',
	description: 'Secret material for @contractspec/integration.runtime.local.',
	fields: {},
});

export const RuntimeLocalIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.runtime-local',
			version: '1.0.0',
			title: 'Runtime Local',
			description: 'Local runtime compatibility wrapper for Builder.',
			domain: 'runtime-local',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'runtime-local'],
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
	configSchema: { schema: RuntimeLocalIntegrationSpecConfig, example: {} },
	secretSchema: { schema: RuntimeLocalIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

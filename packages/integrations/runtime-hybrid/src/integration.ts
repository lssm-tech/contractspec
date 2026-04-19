import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const RuntimeHybridIntegrationSpecConfig = defineSchemaModel({
	name: 'RuntimeHybridIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.runtime.hybrid.',
	fields: {},
});

const RuntimeHybridIntegrationSpecSecrets = defineSchemaModel({
	name: 'RuntimeHybridIntegrationSecret',
	description: 'Secret material for @contractspec/integration.runtime.hybrid.',
	fields: {},
});

export const RuntimeHybridIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.runtime-hybrid',
			version: '1.0.0',
			title: 'Runtime Hybrid',
			description: 'Hybrid runtime compatibility wrapper for Builder.',
			domain: 'runtime-hybrid',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'runtime-hybrid'],
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
	configSchema: { schema: RuntimeHybridIntegrationSpecConfig, example: {} },
	secretSchema: { schema: RuntimeHybridIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

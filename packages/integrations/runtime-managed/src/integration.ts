import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const RuntimeManagedIntegrationSpecConfig = defineSchemaModel({
	name: 'RuntimeManagedIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.runtime.managed.',
	fields: {},
});

const RuntimeManagedIntegrationSpecSecrets = defineSchemaModel({
	name: 'RuntimeManagedIntegrationSecret',
	description: 'Secret material for @contractspec/integration.runtime.managed.',
	fields: {},
});

export const RuntimeManagedIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.runtime-managed',
			version: '1.0.0',
			title: 'Runtime Managed',
			description: 'Managed runtime compatibility wrapper for Builder.',
			domain: 'runtime-managed',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'runtime-managed'],
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
	configSchema: { schema: RuntimeManagedIntegrationSpecConfig, example: {} },
	secretSchema: { schema: RuntimeManagedIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

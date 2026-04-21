import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const HarnessRuntimeIntegrationSpecConfig = defineSchemaModel({
	name: 'HarnessRuntimeIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.harness-runtime.',
	fields: {},
});

const HarnessRuntimeIntegrationSpecSecrets = defineSchemaModel({
	name: 'HarnessRuntimeIntegrationSecret',
	description: 'Secret material for @contractspec/integration.harness-runtime.',
	fields: {},
});

export const HarnessRuntimeIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.harness-runtime',
			version: '1.0.0',
			title: 'Harness Runtime',
			description: 'Runtime adapters for the ContractSpec harness system.',
			domain: 'harness-runtime',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'harness-runtime'],
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
	configSchema: { schema: HarnessRuntimeIntegrationSpecConfig, example: {} },
	secretSchema: { schema: HarnessRuntimeIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const ExampleGeneratorIntegrationSpecConfig = defineSchemaModel({
	name: 'ExampleGeneratorIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.example-generator.',
	fields: {},
});

const ExampleGeneratorIntegrationSpecSecrets = defineSchemaModel({
	name: 'ExampleGeneratorIntegrationSecret',
	description:
		'Secret material for @contractspec/integration.example-generator.',
	fields: {},
});

export const ExampleGeneratorIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.example-generator',
			version: '1.0.0',
			title: 'Example Generator',
			description:
				'Example plugin: Markdown documentation generator for ContractSpec specs',
			domain: 'example-generator',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'example-generator'],
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
	configSchema: { schema: ExampleGeneratorIntegrationSpecConfig, example: {} },
	secretSchema: { schema: ExampleGeneratorIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

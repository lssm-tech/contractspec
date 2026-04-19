import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const BuilderVoiceIntegrationSpecConfig = defineSchemaModel({
	name: 'BuilderVoiceIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.builder-voice.',
	fields: {},
});

const BuilderVoiceIntegrationSpecSecrets = defineSchemaModel({
	name: 'BuilderVoiceIntegrationSecret',
	description: 'Secret material for @contractspec/integration.builder-voice.',
	fields: {},
});

export const BuilderVoiceIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.builder-voice',
			version: '1.0.0',
			title: 'Builder Voice',
			description: 'Voice Builder input integration.',
			domain: 'builder-voice',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'builder-voice'],
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
	configSchema: { schema: BuilderVoiceIntegrationSpecConfig, example: {} },
	secretSchema: { schema: BuilderVoiceIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

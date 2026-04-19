import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const BuilderTelegramIntegrationSpecConfig = defineSchemaModel({
	name: 'BuilderTelegramIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.builder-telegram.',
	fields: {},
});

const BuilderTelegramIntegrationSpecSecrets = defineSchemaModel({
	name: 'BuilderTelegramIntegrationSecret',
	description:
		'Secret material for @contractspec/integration.builder-telegram.',
	fields: {},
});

export const BuilderTelegramIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.builder-telegram',
			version: '1.0.0',
			title: 'Builder Telegram',
			description: 'Telegram Builder control-channel integration.',
			domain: 'builder-telegram',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'builder-telegram'],
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
	configSchema: { schema: BuilderTelegramIntegrationSpecConfig, example: {} },
	secretSchema: { schema: BuilderTelegramIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

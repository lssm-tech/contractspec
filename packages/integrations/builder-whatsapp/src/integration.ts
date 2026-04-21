import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const BuilderWhatsappIntegrationSpecConfig = defineSchemaModel({
	name: 'BuilderWhatsappIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.builder-whatsapp.',
	fields: {},
});

const BuilderWhatsappIntegrationSpecSecrets = defineSchemaModel({
	name: 'BuilderWhatsappIntegrationSecret',
	description:
		'Secret material for @contractspec/integration.builder-whatsapp.',
	fields: {},
});

export const BuilderWhatsappIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.builder-whatsapp',
			version: '1.0.0',
			title: 'Builder Whatsapp',
			description: 'WhatsApp Builder control-channel integration.',
			domain: 'builder-whatsapp',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'builder-whatsapp'],
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
	configSchema: { schema: BuilderWhatsappIntegrationSpecConfig, example: {} },
	secretSchema: { schema: BuilderWhatsappIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});

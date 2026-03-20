import { StabilityEnum } from "@contractspec/lib.contracts-spec/ownership";
import { defineIntegration, IntegrationSpecRegistry } from "../spec";

export const messagingTelegramIntegrationSpec = defineIntegration({
	meta: {
		key: "messaging.telegram",
		version: "1.0.0",
		category: "messaging",
		title: "Telegram Bot API",
		description:
			"Telegram messaging integration for inbound webhook updates, threaded topic messages, and outbound bot replies.",
		domain: "communications",
		owners: ["platform.messaging"],
		tags: ["messaging", "telegram"],
		stability: StabilityEnum.Beta,
	},
	supportedModes: ["managed", "byok"],
	capabilities: {
		provides: [
			{ key: "messaging.inbound", version: "1.0.0" },
			{ key: "messaging.outbound", version: "1.0.0" },
		],
	},
	configSchema: {
		schema: {
			type: "object",
			properties: {
				defaultChatId: {
					type: "string",
					description:
						"Optional default Telegram chat ID used for outbound sends when no chat target is provided.",
				},
				apiBaseUrl: {
					type: "string",
					description:
						"Optional Telegram Bot API base URL override for proxies or self-hosted gateways.",
				},
			},
		},
		example: {
			defaultChatId: "-1001234567890",
			apiBaseUrl: "https://api.telegram.org",
		},
	},
	secretSchema: {
		schema: {
			type: "object",
			required: ["botToken", "secretToken"],
			properties: {
				botToken: {
					type: "string",
					description:
						"Telegram bot token used for sendMessage and webhook registration.",
				},
				secretToken: {
					type: "string",
					description:
						"Webhook secret token expected in the X-Telegram-Bot-Api-Secret-Token header.",
				},
			},
		},
		example: {
			botToken: "123456789:AA***",
			secretToken: "contractspec-telegram-webhook",
		},
	},
	healthCheck: {
		method: "custom",
		timeoutMs: 4000,
	},
	docsUrl: "https://core.telegram.org/bots/api",
	constraints: {
		rateLimit: {
			rpm: 180,
		},
	},
	byokSetup: {
		setupInstructions:
			"Create a Telegram bot with BotFather, set a webhook with a secret token, then provide the bot token and secret token.",
		requiredScopes: ["messages:write", "webhook:receive"],
	},
});

export function registerMessagingTelegramIntegration(
	registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
	return registry.register(messagingTelegramIntegrationSpec);
}

import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
export const messagingSlackIntegrationSpec = defineIntegration({
	meta: {
		key: 'messaging.slack',
		version: '1.0.0',
		category: 'messaging',
		title: 'Slack Messaging Platform',
		description:
			'Slack integration for inbound events, threaded responses, and interactive messaging workflows.',
		domain: 'communications',
		owners: ['platform.messaging'],
		tags: ['messaging', 'slack'],
		stability: StabilityEnum.Beta,
	},
	supportedModes: ['managed', 'byok'],
	transports: [
		{ type: 'rest', baseUrl: 'https://slack.com/api' },
		{
			type: 'webhook',
			inbound: {
				signatureHeader: 'x-slack-signature',
				signingAlgorithm: 'hmac-sha256',
			},
		},
		{ type: 'sdk', packageName: '@slack/web-api' },
	],
	preferredTransport: 'rest',
	supportedAuthMethods: [
		{
			type: 'oauth2',
			grantType: 'authorization_code',
			authorizationUrl: 'https://slack.com/oauth/v2/authorize',
			tokenUrl: 'https://slack.com/api/oauth.v2.access',
			scopes: ['chat:write', 'channels:history', 'commands'],
		},
		{ type: 'bearer' },
		{
			type: 'webhook-signing',
			algorithm: 'hmac-sha256',
			signatureHeader: 'x-slack-signature',
		},
	],
	capabilities: {
		provides: [
			{ key: 'messaging.inbound', version: '1.0.0' },
			{ key: 'messaging.outbound', version: '1.0.0' },
			{ key: 'messaging.interactions', version: '1.0.0' },
		],
	},
	configSchema: {
		schema: {
			type: 'object',
			properties: {
				defaultChannelId: {
					type: 'string',
					description:
						'Optional default Slack channel ID for outbound messages.',
				},
				allowUserMentions: {
					type: 'boolean',
					description:
						'Whether user mention expansion is enabled in responses.',
				},
			},
		},
		example: {
			defaultChannelId: 'C0123456789',
			allowUserMentions: true,
		},
	},
	secretSchema: {
		schema: {
			type: 'object',
			required: ['botToken', 'signingSecret'],
			properties: {
				botToken: {
					type: 'string',
					description: 'Slack bot token used for Web API calls.',
				},
				signingSecret: {
					type: 'string',
					description: 'Slack signing secret used to verify inbound webhooks.',
				},
				appToken: {
					type: 'string',
					description:
						'Optional app-level token for socket mode or advanced API usage.',
				},
			},
		},
		example: {
			botToken: 'xoxb-***',
			signingSecret: '***',
		},
	},
	healthCheck: {
		method: 'custom',
		timeoutMs: 4000,
	},
	docsUrl: 'https://api.slack.com',
	constraints: {
		rateLimit: {
			rpm: 200,
		},
	},
	byokSetup: {
		setupInstructions:
			'Create a Slack app, install it to your workspace, then provide bot token and signing secret.',
		requiredScopes: ['chat:write', 'channels:history', 'commands'],
		keyRotationSupported: true,
		quotaTrackingSupported: false,
	},
});

export function registerMessagingSlackIntegration(
	registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
	return registry.register(messagingSlackIntegrationSpec);
}

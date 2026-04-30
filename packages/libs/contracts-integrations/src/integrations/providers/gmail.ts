import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
export const gmailIntegrationSpec = defineIntegration({
	meta: {
		key: 'email.gmail',
		version: '1.0.0',
		category: 'email',
		title: 'Google Gmail API',
		description:
			'Gmail integration supporting inbound thread ingestion and outbound transactional email.',
		domain: 'communications',
		owners: ['platform.messaging'],
		tags: ['email', 'gmail'],
		stability: StabilityEnum.Beta,
	},
	supportedModes: ['managed', 'byok'],
	transports: [
		{ type: 'rest', baseUrl: 'https://gmail.googleapis.com' },
		{ type: 'sdk', packageName: 'googleapis', minVersion: '130.0.0' },
	],
	preferredTransport: 'rest',
	supportedAuthMethods: [
		{
			type: 'oauth2',
			grantType: 'authorization_code',
			authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: ['https://www.googleapis.com/auth/gmail.modify'],
			pkce: true,
		},
		{ type: 'service-account', credentialFormat: 'json-key' },
	],
	capabilities: {
		provides: [
			{ key: 'email.inbound', version: '1.0.0' },
			{ key: 'email.outbound', version: '1.0.0' },
			{ key: 'provider.delta.watch', version: '1.0.0' },
		],
	},
	configSchema: {
		schema: {
			type: 'object',
			properties: {
				labelIds: {
					type: 'array',
					items: { type: 'string' },
					description: 'Optional list of label IDs to scope inbound sync.',
				},
				includeSpamTrash: {
					type: 'boolean',
					description: 'Whether to include spam or trash messages during sync.',
				},
				webhookTopic: {
					type: 'string',
					description:
						'Optional Pub/Sub topic used for Gmail watch notifications.',
				},
				historyCursor: {
					type: 'string',
					description:
						'Optional Gmail history cursor to resume incremental sync.',
				},
			},
		},
		example: {
			labelIds: ['INBOX'],
			includeSpamTrash: false,
		},
	},
	secretSchema: {
		schema: {
			type: 'object',
			required: ['clientId', 'clientSecret', 'refreshToken'],
			properties: {
				clientId: {
					type: 'string',
					description: 'OAuth client ID for the Google Cloud project.',
				},
				clientSecret: {
					type: 'string',
					description: 'OAuth client secret for the Google Cloud project.',
				},
				refreshToken: {
					type: 'string',
					description: 'OAuth refresh token for delegated Gmail access.',
				},
				redirectUri: {
					type: 'string',
					description:
						'Optional redirect URI used when issuing the refresh token.',
				},
			},
		},
		example: {
			clientId: 'xxx.apps.googleusercontent.com',
			clientSecret: 'secret',
			refreshToken: 'refresh-token',
		},
	},
	healthCheck: {
		method: 'custom',
		timeoutMs: 4000,
	},
	docsUrl: 'https://developers.google.com/gmail/api',
	constraints: {
		rateLimit: {
			rpm: 600,
		},
	},
	byokSetup: {
		setupInstructions:
			'Create an OAuth consent screen and credentials within Google Cloud Console, then authorize the Gmail scopes and store the resulting refresh token.',
		keyRotationSupported: false,
		quotaTrackingSupported: false,
	},
});

export function registerGmailIntegration(
	registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
	return registry.register(gmailIntegrationSpec);
}

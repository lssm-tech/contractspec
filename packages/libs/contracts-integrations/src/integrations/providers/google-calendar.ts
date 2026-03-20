import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import type { IntegrationAuthConfig } from '../auth';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
import type { IntegrationTransportConfig } from '../transport';

export const googleCalendarIntegrationSpec = defineIntegration({
	meta: {
		key: 'calendar.google',
		version: '1.0.0',
		category: 'calendar',
		title: 'Google Calendar API',
		description:
			'Google Calendar integration for event creation, updates, and scheduling automations.',
		domain: 'productivity',
		owners: ['platform.messaging'],
		tags: ['calendar', 'google'],
		stability: StabilityEnum.Beta,
	},
	supportedModes: ['managed', 'byok'],
	transports: [
		{ type: 'rest', baseUrl: 'https://www.googleapis.com/calendar' },
		{ type: 'sdk', packageName: 'googleapis' },
	] satisfies IntegrationTransportConfig[],
	preferredTransport: 'rest',
	supportedAuthMethods: [
		{
			type: 'oauth2',
			grantType: 'authorization_code',
			authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: ['https://www.googleapis.com/auth/calendar'],
			pkce: true,
		},
		{ type: 'service-account', credentialFormat: 'json-key' },
	] satisfies IntegrationAuthConfig[],
	capabilities: {
		provides: [{ key: 'calendar.events', version: '1.0.0' }],
	},
	configSchema: {
		schema: {
			type: 'object',
			properties: {
				calendarId: {
					type: 'string',
					description: 'Default calendar identifier (defaults to primary).',
				},
			},
		},
		example: {
			calendarId: 'primary',
		},
	},
	secretSchema: {
		schema: {
			type: 'object',
			required: ['clientEmail', 'privateKey'],
			properties: {
				clientEmail: {
					type: 'string',
					description: 'Service account client email.',
				},
				privateKey: {
					type: 'string',
					description: 'Service account private key.',
				},
				projectId: {
					type: 'string',
					description: 'Google Cloud project ID.',
				},
			},
		},
		example: {
			clientEmail: 'svc-calendar@example.iam.gserviceaccount.com',
			privateKey: '-----BEGIN PRIVATE KEY-----...',
			projectId: 'calendar-project',
		},
	},
	healthCheck: {
		method: 'custom',
		timeoutMs: 4000,
	},
	docsUrl: 'https://developers.google.com/calendar/api',
	constraints: {},
	byokSetup: {
		setupInstructions:
			'Create a Google service account with Calendar access and share the target calendars with the service account email.',
		keyRotationSupported: false,
		quotaTrackingSupported: false,
	},
});

export function registerGoogleCalendarIntegration(
	registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
	return registry.register(googleCalendarIntegrationSpec);
}

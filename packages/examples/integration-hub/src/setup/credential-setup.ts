import type { IntegrationCredentialManifest } from '@contractspec/lib.contracts-integrations';
import type { EnvironmentConfig } from '@contractspec/lib.contracts-spec/workspace-config/environment';

export const integrationHubCredentialManifest = {
	modes: {
		managed: {
			mode: 'managed',
			configFields: [
				{
					key: 'workspaceId',
					required: true,
					description:
						'Managed ContractSpec workspace that owns the provider connection.',
				},
				{
					key: 'region',
					required: true,
					description: 'Provider region used by the managed connector runtime.',
				},
			],
			validationStrategy: 'provider-health',
			setupSteps: [
				'Select the workspace-owned managed connector.',
				'Run the provider health check before enabling sync jobs.',
			],
		},
		byok: {
			mode: 'byok',
			configFields: [
				{
					key: 'projectApiKey',
					required: true,
					envVar: 'POSTHOG_PROJECT_API_KEY',
					description:
						'Public analytics project key exposed through app-specific aliases.',
				},
			],
			secretFields: [
				{
					key: 'personalApiKey',
					required: true,
					envVar: 'POSTHOG_PERSONAL_API_KEY',
					description:
						'Server-only BYOK secret used for provider administration calls.',
				},
				{
					key: 'webhookSecret',
					required: true,
					envVar: 'INTEGRATION_HUB_WEBHOOK_SECRET',
					description:
						'Server-only signing secret for incoming integration webhooks.',
				},
			],
			validationStrategy: 'byok-lifecycle',
			rotation: { supported: true, recommendedIntervalDays: 90 },
			allowedSecretProviders: ['env', 'vault', 'vercel', 'doppler'],
			setupSteps: [
				'Create a restricted provider key with read/write access for sync metadata.',
				'Store the key through a secret reference, never as a raw value in app config.',
				'Materialize only public config aliases into browser or native app bundles.',
			],
		},
	},
} satisfies IntegrationCredentialManifest;

export const integrationHubEnvironmentConfig = {
	targets: {
		webConsole: {
			id: 'webConsole',
			packageName: '@acme/integration-web',
			packagePath: 'apps/web',
			framework: 'next',
			surfaces: ['server', 'public-client'],
			envFiles: ['apps/web/.env.local'],
		},
		mobileConsole: {
			id: 'mobileConsole',
			packageName: '@acme/integration-mobile',
			packagePath: 'apps/mobile',
			framework: 'expo',
			surfaces: ['native-client'],
			envFiles: ['apps/mobile/.env'],
		},
		syncWorker: {
			id: 'syncWorker',
			packageName: '@acme/integration-worker',
			packagePath: 'apps/worker',
			framework: 'node',
			surfaces: ['server', 'worker'],
			envFiles: ['apps/worker/.env'],
		},
	},
	variables: {
		publicOrigin: {
			key: 'publicOrigin',
			description:
				'Origin shared by web and mobile clients for integration callbacks.',
			sensitivity: 'public',
			allowedSurfaces: ['public-client', 'native-client'],
			aliases: [
				{
					targetId: 'webConsole',
					framework: 'next',
					name: 'NEXT_PUBLIC_INTEGRATION_HUB_ORIGIN',
					exposure: 'public-client',
				},
				{
					targetId: 'mobileConsole',
					framework: 'expo',
					name: 'EXPO_PUBLIC_INTEGRATION_HUB_ORIGIN',
					exposure: 'native-client',
				},
			],
		},
		projectApiKey: {
			key: 'projectApiKey',
			description: 'Public analytics key scoped to product usage capture.',
			sensitivity: 'public',
			allowedSurfaces: ['public-client', 'native-client'],
			valueSource: { type: 'byok-connection', connectionId: 'conn_posthog' },
			aliases: [
				{
					targetId: 'webConsole',
					framework: 'next',
					name: 'NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY',
					exposure: 'public-client',
				},
				{
					targetId: 'mobileConsole',
					framework: 'expo',
					name: 'EXPO_PUBLIC_POSTHOG_PROJECT_API_KEY',
					exposure: 'native-client',
				},
			],
		},
		personalApiKey: {
			key: 'personalApiKey',
			description: 'Server-only provider administration token.',
			sensitivity: 'secret',
			allowedSurfaces: ['server', 'worker'],
			valueSource: {
				type: 'secret',
				secretRef: 'env://POSTHOG_PERSONAL_API_KEY',
			},
			aliases: [
				{
					targetId: 'syncWorker',
					framework: 'node',
					name: 'POSTHOG_PERSONAL_API_KEY',
					exposure: 'server',
				},
			],
		},
		webhookSecret: {
			key: 'webhookSecret',
			description: 'Server-only secret for validating provider webhooks.',
			sensitivity: 'secret',
			allowedSurfaces: ['server', 'worker'],
			aliases: [
				{
					targetId: 'syncWorker',
					framework: 'node',
					name: 'INTEGRATION_HUB_WEBHOOK_SECRET',
					exposure: 'server',
				},
			],
		},
	},
	secretRequirements: {
		personalApiKey: {
			key: 'personalApiKey',
			required: true,
			envVar: 'POSTHOG_PERSONAL_API_KEY',
			provider: 'env',
			rotationDays: 90,
		},
		webhookSecret: {
			key: 'webhookSecret',
			required: true,
			envVar: 'INTEGRATION_HUB_WEBHOOK_SECRET',
			provider: 'env',
			rotationDays: 90,
		},
	},
} satisfies EnvironmentConfig;

export const integrationHubCredentialSetupState = {
	selectedMode: 'byok',
	targetIds: ['webConsole', 'mobileConsole', 'syncWorker'],
	configValues: {
		projectApiKey: 'public-project-key-ref',
	},
	secretRefs: {
		personalApiKey: 'env://POSTHOG_PERSONAL_API_KEY',
	},
} as const;

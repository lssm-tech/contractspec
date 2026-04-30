import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import type { IntegrationAuthConfig } from '../auth';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';
import type { IntegrationTransportConfig } from '../transport';
import type { ProviderDeltaSyncState } from './provider-delta';

export interface GoogleDriveFileMetadata {
	id: string;
	name: string;
	mimeType: string;
	modifiedTime?: string | Date;
	sizeBytes?: number;
	md5Checksum?: string;
	webViewLink?: string;
	parents?: string[];
	trashed?: boolean;
	metadata?: Record<string, string>;
	delta?: ProviderDeltaSyncState;
}

export type GoogleDriveFileBody =
	| { data: Uint8Array; stream?: never }
	| { data?: never; stream: AsyncIterable<Uint8Array> };

export type GoogleDriveFile = GoogleDriveFileMetadata & GoogleDriveFileBody;

export interface GoogleDriveListFilesQuery {
	query?: string;
	pageSize?: number;
	pageToken?: string;
	driveId?: string;
	spaces?: string[];
	includeItemsFromAllDrives?: boolean;
	delta?: ProviderDeltaSyncState;
}

export interface GoogleDriveListFilesResult {
	files: GoogleDriveFileMetadata[];
	nextPageToken?: string;
	delta?: ProviderDeltaSyncState;
}

export interface GoogleDriveWatchInput {
	channelId: string;
	webhookUrl: string;
	token?: string;
	expiresAt?: string | Date;
	delta?: ProviderDeltaSyncState;
}

export interface GoogleDriveWatchResult {
	delta: ProviderDeltaSyncState;
}

export interface GoogleDriveProvider {
	listFiles(
		query?: GoogleDriveListFilesQuery
	): Promise<GoogleDriveListFilesResult>;
	getFile(fileId: string): Promise<GoogleDriveFile | null>;
	watchChanges?(input: GoogleDriveWatchInput): Promise<GoogleDriveWatchResult>;
}

export const googleDriveIntegrationSpec = defineIntegration({
	meta: {
		key: 'storage.google-drive',
		version: '1.0.0',
		category: 'storage',
		title: 'Google Drive API',
		description:
			'Google Drive integration for file search, file retrieval, change watches, and knowledge ingestion.',
		domain: 'productivity',
		owners: ['platform.integrations'],
		tags: ['storage', 'google-drive', 'knowledge'],
		stability: StabilityEnum.Beta,
	},
	supportedModes: ['managed', 'byok'],
	transports: [
		{ type: 'rest', baseUrl: 'https://www.googleapis.com/drive/v3' },
		{ type: 'sdk', packageName: 'googleapis' },
	] satisfies IntegrationTransportConfig[],
	preferredTransport: 'rest',
	supportedAuthMethods: [
		{
			type: 'oauth2',
			grantType: 'authorization_code',
			authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				'https://www.googleapis.com/auth/drive.readonly',
				'https://www.googleapis.com/auth/drive.metadata.readonly',
			],
			pkce: true,
		},
		{ type: 'service-account', credentialFormat: 'json-key' },
	] satisfies IntegrationAuthConfig[],
	capabilities: {
		provides: [
			{ key: 'storage.objects', version: '1.0.0' },
			{ key: 'knowledge.ingestion.drive', version: '1.0.0' },
			{ key: 'provider.delta.watch', version: '1.0.0' },
		],
	},
	configSchema: {
		schema: {
			type: 'object',
			properties: {
				driveId: {
					type: 'string',
					description: 'Optional shared drive identifier.',
				},
				query: {
					type: 'string',
					description: 'Optional Drive search query for scoped sync.',
				},
				includeItemsFromAllDrives: {
					type: 'boolean',
					description: 'Whether shared-drive files are included.',
				},
				webhookUrl: {
					type: 'string',
					description: 'Optional webhook endpoint for Drive change watches.',
				},
			},
		},
		example: {
			query: "mimeType = 'text/plain' and trashed = false",
			includeItemsFromAllDrives: true,
		},
	},
	secretSchema: {
		schema: {
			type: 'object',
			properties: {
				clientId: { type: 'string' },
				clientSecret: { type: 'string' },
				refreshToken: { type: 'string' },
				clientEmail: { type: 'string' },
				privateKey: { type: 'string' },
				projectId: { type: 'string' },
			},
		},
		example: {
			clientId: 'xxx.apps.googleusercontent.com',
			refreshToken: 'refresh-token',
		},
	},
	healthCheck: {
		method: 'custom',
		timeoutMs: 4000,
	},
	docsUrl: 'https://developers.google.com/drive/api',
	constraints: {
		rateLimit: {
			rpm: 600,
		},
	},
	byokSetup: {
		setupInstructions:
			'Authorize Google Drive readonly scopes or share the target Drive folders with a service account before enabling sync.',
		requiredScopes: [
			'https://www.googleapis.com/auth/drive.readonly',
			'https://www.googleapis.com/auth/drive.metadata.readonly',
		],
		keyRotationSupported: false,
		quotaTrackingSupported: false,
	},
});

export function registerGoogleDriveIntegration(
	registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
	return registry.register(googleDriveIntegrationSpec);
}

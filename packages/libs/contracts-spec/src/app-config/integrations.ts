import type { CapabilityRef } from '../capabilities';
import type { OwnerShipMeta } from '../ownership';

export type IntegrationCategory =
	| 'payments'
	| 'email'
	| 'calendar'
	| 'sms'
	| 'messaging'
	| 'health'
	| 'ai-llm'
	| 'ai-voice-tts'
	| 'ai-voice-stt'
	| 'ai-voice-conversational'
	| 'ai-image'
	| 'analytics'
	| 'vector-db'
	| 'storage'
	| 'accounting'
	| 'crm'
	| 'helpdesk'
	| 'project-management'
	| 'open-banking'
	| 'meeting-recorder'
	| 'database'
	| 'custom';

export type IntegrationOwnershipMode = 'managed' | 'byok';

export type IntegrationConnectionStatus =
	| 'connected'
	| 'disconnected'
	| 'error'
	| 'unknown';

export interface AppIntegrationBinding {
	/** Which slot this binding satisfies. */
	slotId: string;
	/** Which IntegrationConnection to use. */
	connectionId: string;
	/** Optional: scope to specific workflows/features. */
	scope?: {
		workflows?: string[];
		features?: string[];
		operations?: string[];
	};
	/** Priority when multiple connections provide same capability. */
	priority?: number;
}

export interface AppConfigIntegrationMeta extends OwnerShipMeta {
	category: IntegrationCategory;
}

export interface AppConfigIntegrationSpec {
	meta: AppConfigIntegrationMeta;
	supportedModes: IntegrationOwnershipMode[];
	capabilities: {
		provides: CapabilityRef[];
	};
	configSchema: {
		schema: unknown;
		example?: Record<string, unknown>;
	};
	secretSchema: {
		schema: unknown;
		example?: Record<string, string>;
	};
}

export interface AppConfigIntegrationConnectionHealth {
	status: IntegrationConnectionStatus;
	checkedAt?: Date;
	latencyMs?: number;
	errorCode?: string;
	errorMessage?: string;
}

export interface AppConfigIntegrationRegistry {
	get(key: string, version?: string): AppConfigIntegrationSpec | undefined;
}

export interface AppConfigIntegrationConnection {
	meta: {
		id: string;
		tenantId: string;
		integrationKey: string;
		integrationVersion: string;
		label: string;
		environment?: string;
		createdAt: string | Date;
		updatedAt: string | Date;
	};
	ownershipMode: IntegrationOwnershipMode;
	config: Record<string, unknown>;
	secretProvider: string;
	secretRef: string;
	status: IntegrationConnectionStatus;
	health?: AppConfigIntegrationConnectionHealth;
}

import type { IntegrationAuthType, OAuth2TokenState } from './auth';
import type { ByokKeyMetadata } from './byok';
import type { IntegrationOwnershipMode } from './spec';
import type { IntegrationTransportType } from './transport';

export type ConnectionStatus =
	| 'connected'
	| 'disconnected'
	| 'error'
	| 'unknown';

export interface IntegrationConnectionHealth {
	status: ConnectionStatus;
	checkedAt?: Date;
	latencyMs?: number;
	errorCode?: string;
	errorMessage?: string;
}

export interface IntegrationUsageMetrics {
	requestCount?: number;
	successCount?: number;
	errorCount?: number;
	lastUsed?: Date;
	lastSuccessAt?: Date;
	lastErrorAt?: Date;
	lastErrorCode?: string;
}

export interface IntegrationConnectionMeta {
	id: string;
	tenantId: string;
	/** Reference to IntegrationSpec. */
	integrationKey: string;
	integrationVersion: string;
	/** Human-readable label (e.g., "Production Stripe"). */
	label: string;
	environment?: string;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export interface IntegrationConnection {
	meta: IntegrationConnectionMeta;
	/** Ownership mode indicating who controls credentials. */
	ownershipMode: IntegrationOwnershipMode;
	/** External provider account/project identifier (BYOK scenarios). */
	externalAccountId?: string;
	/** Encrypted configuration matching IntegrationSpec.configSchema. */
	config: Record<string, unknown>;
	/** Reference to external secret store entry containing credentials. */
	secretProvider: string;
	secretRef: string;
	status: ConnectionStatus;
	/** Last health check result. */
	health?: IntegrationConnectionHealth;
	/** Usage tracking. */
	usage?: IntegrationUsageMetrics;

	/** Which transport this connection is currently using. */
	activeTransport?: IntegrationTransportType;
	/** Transport-specific runtime config overrides. */
	transportConfig?: Record<string, unknown>;
	/** Which auth method this connection is using. */
	authMethod?: IntegrationAuthType;
	/** OAuth2 token state when authMethod is "oauth2". */
	oauth2State?: OAuth2TokenState;
	/** Provider API version this connection targets. */
	apiVersion?: string;
	/** BYOK key lifecycle metadata (only when ownershipMode is "byok"). */
	byokKeyMetadata?: ByokKeyMetadata;
}

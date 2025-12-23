import type { IntegrationOwnershipMode } from './spec';

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
  integrationVersion: number;
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
}

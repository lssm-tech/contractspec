import type { IntegrationOwnershipMode } from './spec';

export type ConnectionStatus =
  | 'active'
  | 'inactive'
  | 'error'
  | 'pending_verification';

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
  secretRef: string;
  status: ConnectionStatus;
  /** Last health check result. */
  lastHealthCheck?: {
    timestamp: Date;
    success: boolean;
    error?: string;
  };
  /** Usage tracking. */
  usage?: {
    requestCount?: number;
    lastUsed?: Date;
  };
}


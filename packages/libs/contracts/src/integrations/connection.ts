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
  /** Encrypted configuration matching IntegrationSpec.configSchema. */
  config: Record<string, unknown>;
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


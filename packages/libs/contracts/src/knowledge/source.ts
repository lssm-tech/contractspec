export type KnowledgeSourceType =
  | 'notion'
  | 'url'
  | 'file_upload'
  | 'email'
  | 'api'
  | 'manual';

export interface KnowledgeSourceMeta {
  id: string;
  tenantId: string;
  spaceKey: string;
  spaceVersion: number;
  label: string;
  sourceType: KnowledgeSourceType;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface KnowledgeSourceConfig {
  meta: KnowledgeSourceMeta;
  /** Source-specific configuration (URLs, credentials, filters). */
  config: Record<string, unknown>;
  /** Sync schedule (cron or interval). */
  syncSchedule?: {
    enabled: boolean;
    cron?: string;
    intervalMs?: number;
  };
  /** Last sync status. */
  lastSync?: {
    timestamp: Date;
    success: boolean;
    itemsProcessed?: number;
    error?: string;
  };
}




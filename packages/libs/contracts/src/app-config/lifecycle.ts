import type { TenantAppConfig } from './spec';

export type ConfigStatus =
  | 'draft'
  | 'preview'
  | 'published'
  | 'archived'
  | 'superseded';

export interface TenantAppConfigVersion {
  meta: TenantAppConfig['meta'];
  config: TenantAppConfig;
}

export interface ConfigTransition {
  tenantId: string;
  appId: string;
  fromStatus: ConfigStatus;
  toStatus: ConfigStatus;
  version: number;
  timestamp: string | Date;
  actor: string;
  reason?: string;
}

export interface ConfigVersionHistory {
  tenantId: string;
  appId: string;
  versions: TenantAppConfigVersion[];
  transitions: ConfigTransition[];
  currentPublished?: number;
}









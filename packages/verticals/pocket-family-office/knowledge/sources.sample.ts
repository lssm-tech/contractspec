import type { KnowledgeSourceConfig } from '@lssm/lib.contracts/knowledge/source';

const now = new Date();

export const pocketFamilyOfficeKnowledgeSources: KnowledgeSourceConfig[] = [
  {
    meta: {
      id: 'source-financial-uploads',
      tenantId: 'tenant.family-office',
      spaceKey: 'knowledge.financial-docs',
      spaceVersion: 1,
      label: 'Uploaded Financial Documents',
      sourceType: 'file_upload',
      createdAt: now,
      updatedAt: now,
    },
    config: {
      bucket: 'pfo-uploads',
      prefix: 'financial-docs/',
    },
    syncSchedule: {
      enabled: true,
      intervalMs: 15 * 60 * 1000,
    },
    lastSync: {
      timestamp: now,
      success: true,
    },
  },
  {
    meta: {
      id: 'source-gmail-threads',
      tenantId: 'tenant.family-office',
      spaceKey: 'knowledge.email-threads',
      spaceVersion: 1,
      label: 'Household Gmail Threads',
      sourceType: 'email',
      createdAt: now,
      updatedAt: now,
    },
    config: {
      labelIds: ['INBOX', 'FINANCE'],
    },
    syncSchedule: {
      enabled: true,
      intervalMs: 5 * 60 * 1000,
    },
    lastSync: {
      timestamp: now,
      success: true,
    },
  },
];






import type { KnowledgeSourceConfig } from '@lssm/lib.contracts/knowledge/source';

export const productCanonNotionSource: KnowledgeSourceConfig = {
  meta: {
    id: 'source-canon-notion',
    tenantId: 'artisan-co',
    spaceKey: 'knowledge.product-canon',
    spaceVersion: 1,
    label: 'Product Canon (Notion)',
    sourceType: 'notion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  config: {
    notionDatabaseId: 'xxxxxxxxxxxxxxxx',
    apiKey: 'secret_notion_token',
  },
  syncSchedule: {
    enabled: true,
    cron: '0 * * * *',
  },
  lastSync: {
    timestamp: new Date().toISOString(),
    success: true,
    itemsProcessed: 128,
  },
};




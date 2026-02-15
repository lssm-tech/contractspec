import type { KnowledgeSourceConfig } from '@contractspec/lib.contracts-spec/knowledge/source';

export const productCanonNotionSource: KnowledgeSourceConfig = {
  meta: {
    id: 'source-canon-notion',
    tenantId: 'artisan-co',
    spaceKey: 'knowledge.product-canon',
    spaceVersion: '1.0.0',
    label: 'Product Canon (Notion)',
    sourceType: 'notion',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
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
    timestamp: new Date('2026-01-01T00:00:00.000Z'),
    success: true,
    itemsProcessed: 128,
  },
};

import type { TenantAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const artisanKnowledgeTenantConfig: TenantAppConfig = {
  meta: {
    id: 'tenant-config-artisan-knowledge',
    tenantId: 'artisan-co',
    appId: 'artisan',
    blueprintName: 'artisan.knowledge.product',
    blueprintVersion: '1.0.0',
    environment: 'production',
    version: '1.0.0',
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  knowledge: [
    {
      spaceKey: 'knowledge.product-canon',
      spaceVersion: '1.0.0',
      scope: {
        workflows: ['answerFaq'],
        agents: ['productSupportAssistant'],
      },
      constraints: {
        maxTokensPerQuery: 4096,
        maxQueriesPerMinute: 30,
      },
    },
  ],
  integrations: [],
  notes: 'Product Canon knowledge space bound for production assistants.',
};

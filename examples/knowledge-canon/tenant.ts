import type { TenantAppConfig } from '@lssm/lib.contracts/app-config/spec';

export const artisanKnowledgeTenantConfig: TenantAppConfig = {
  meta: {
    id: 'tenant-config-artisan-knowledge',
    tenantId: 'artisan-co',
    appId: 'artisan',
    blueprintName: 'artisan.knowledge.product',
    blueprintVersion: 1,
    environment: 'production',
    version: 1,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  knowledge: [
    {
      spaceKey: 'knowledge.product-canon',
      spaceVersion: 1,
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


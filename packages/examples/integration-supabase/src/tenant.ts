import type { TenantAppConfig } from '@contractspec/lib.contracts/app-config/spec';

export const supabaseKnowledgeTenantConfig: TenantAppConfig = {
  meta: {
    id: 'tenant-config-knowledge-supabase',
    tenantId: 'acme-knowledge',
    appId: 'knowledge-assistant',
    blueprintName: 'knowledge.supabase.dual-store',
    blueprintVersion: '1.0.0',
    environment: 'production',
    version: '1.0.0',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  integrations: [
    {
      slotId: 'primary-vector-db',
      connectionId: 'conn-supabase-vector',
      scope: {
        workflows: ['ingestKnowledge'],
        operations: ['knowledge.indexChunks', 'knowledge.semanticSearch'],
      },
    },
    {
      slotId: 'primary-database',
      connectionId: 'conn-supabase-db',
      scope: {
        workflows: ['refreshMetrics'],
        operations: ['knowledge.metrics.refresh', 'knowledge.metrics.query'],
      },
    },
  ],
  knowledge: [],
  locales: {
    defaultLocale: 'en',
    enabledLocales: ['en'],
  },
  notes:
    'Supabase vector + SQL connections bound for production knowledge flows.',
};

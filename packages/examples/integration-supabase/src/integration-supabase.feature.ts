import { defineFeature } from '@contractspec/lib.contracts-spec';

export const IntegrationSupabaseFeature = defineFeature({
  meta: {
    key: 'integration-supabase',
    version: '1.0.0',
    title: 'Supabase Vector + Postgres Integration',
    description:
      'Supabase integration with vector store and Postgres database wiring',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'supabase', 'vector-store', 'postgres'],
    stability: 'experimental',
  },

  integrations: [
    { key: 'integration-supabase.integration.vector', version: '1.0.0' },
    { key: 'integration-supabase.integration.postgres', version: '1.0.0' },
  ],

  knowledge: [
    { key: 'integration-supabase.knowledge.dual-store', version: '1.0.0' },
  ],

  docs: [
    'docs.examples.integration-supabase',
    'docs.examples.integration-supabase.usage',
  ],
});

import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'integration-supabase',
    version: '1.0.0',
    title: 'Integration - Supabase Vector + Postgres',
    description:
      'Wire AppBlueprint and TenantAppConfig to use Supabase for both vector retrieval and SQL workloads.',
    kind: 'integration',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['supabase', 'pgvector', 'postgres', 'integration', 'knowledge'],
  },
  docs: {
    rootDocId: 'docs.examples.integration-supabase',
    usageDocId: 'docs.examples.integration-supabase.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.integration-supabase',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;

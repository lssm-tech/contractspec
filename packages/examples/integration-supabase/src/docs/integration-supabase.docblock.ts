import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.integration-supabase',
    title: 'Integration Example - Supabase Vector + Postgres',
    summary:
      'Reference example wiring Supabase vector and SQL integrations in one tenant configuration.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/integration-supabase',
    tags: ['supabase', 'vector-db', 'database', 'integration', 'example'],
    body: `## What this example includes
- A blueprint declaring two required integration slots:
  - \`primary-vector-db\` bound to \`vectordb.supabase\`
  - \`primary-database\` bound to \`database.supabase\`
- A tenant config binding both slots.
- Connection samples with clear \`config\` vs \`secretRef\` separation.
- A runtime sample that upserts/searches vectors and executes SQL queries.

## Why this pattern
- Keeps integration concerns explicit and auditable in app-config.
- Enables shared Supabase infrastructure for retrieval + analytics.
- Preserves secret management boundaries (no credentials in config/spec).`,
  },
  {
    id: 'docs.examples.integration-supabase.usage',
    title: 'Supabase Integration Example - Usage',
    summary:
      'Step-by-step usage of the Supabase dual-store integration example.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/integration-supabase/usage',
    tags: ['supabase', 'usage'],
    body: `## Usage
1) Register integration specs from \`createDefaultIntegrationSpecRegistry()\`.
2) Persist both sample connections from \`connection.sample.ts\`.
3) Publish the tenant config from \`tenant.ts\` with matching \`connectionId\` values.
4) Use \`runSupabaseKnowledgeRuntime(...)\` to execute vector and SQL calls through \`IntegrationProviderFactory\`.

## Secret payload
Store the following payload in your secret provider target for each connection:

\`\`\`json
{
  "databaseUrl": "postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"
}
\`\`\`

## Guardrails
- Never place credentials in \`config\` or source control.
- Keep operational SQL behind explicit workflows/operations.
- Restrict DB credentials to least-privilege roles whenever possible.`,
  },
];

registerDocBlocks(blocks);

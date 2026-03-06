import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '../../registry';

export const tech_database_context_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.database.context',
    title: 'Database context',
    summary: 'Schema, migrations, dictionary, and read-only query surfaces.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/database/context',
    tags: ['database', 'context'],
    body: `# Database context

Database context covers schema descriptions, migrations, data dictionary entries, and governed read-only access.
`,
  },
  {
    id: 'docs.tech.database.schema.describe',
    title: 'Describe database schema',
    summary: 'Describe schemas and models with PII signals.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/database/schema/describe',
    tags: ['database', 'schema'],
    body: `# database.schema.describe

Returns deterministic schema summaries for agents and operators.
`,
  },
  {
    id: 'docs.tech.database.schema.index',
    title: 'Database schema index view',
    summary: 'Data view for listing schemas and model counts.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/database/schema/index',
    tags: ['database', 'data-view'],
    body: `# database.schema.index

List view for database schemas and their metadata.
`,
  },
  {
    id: 'docs.tech.database.migrations.list',
    title: 'List database migrations',
    summary: 'List migration history for a database.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/database/migrations/list',
    tags: ['database', 'migrations'],
    body: `# database.migrations.list

Returns migration registry entries and statuses for auditability.
`,
  },
  {
    id: 'docs.tech.database.dictionary.get',
    title: 'Get data dictionary entry',
    summary: 'Retrieve a dictionary entry for a schema field.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/database/dictionary/get',
    tags: ['database', 'dictionary'],
    body: `# database.dictionary.get

Returns semantic descriptions and PII tags for fields.
`,
  },
  {
    id: 'docs.tech.database.query.readonly',
    title: 'Read-only data query',
    summary: 'Perform a governed read-only query via data views.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/database/query/readonly',
    tags: ['database', 'query', 'readonly'],
    body: `# database.query.readonly

Executes read-only data access using data views with policy and redaction.
`,
  },
];

registerDocBlocks(tech_database_context_DocBlocks);

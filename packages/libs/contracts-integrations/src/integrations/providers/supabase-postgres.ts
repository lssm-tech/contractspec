import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const supabasePostgresIntegrationSpec = defineIntegration({
  meta: {
    key: 'database.supabase',
    version: '1.0.0',
    category: 'database',
    title: 'Supabase Postgres',
    description:
      'Supabase Postgres integration for SQL query execution and transactional workloads.',
    domain: 'infrastructure',
    owners: ['platform.infrastructure'],
    tags: ['database', 'postgres', 'supabase'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'database.sql', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        maxConnections: {
          type: 'number',
          description:
            'Optional connection pool size when opening a Postgres client to Supabase.',
        },
        sslMode: {
          type: 'string',
          enum: ['require', 'allow', 'prefer'],
          description: 'TLS mode used by the Postgres client.',
        },
      },
    },
    example: {
      maxConnections: 10,
      sslMode: 'require',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['databaseUrl'],
      properties: {
        databaseUrl: {
          type: 'string',
          description:
            'Supabase Postgres connection string (transaction or session pooler endpoint).',
        },
      },
    },
    example: {
      databaseUrl:
        'postgresql://postgres.[project-ref]:password@aws-0-region.pooler.supabase.com:6543/postgres',
    },
  },
  healthCheck: {
    method: 'ping',
    timeoutMs: 5000,
  },
  docsUrl: 'https://supabase.com/docs/guides/database/connecting-to-postgres',
  byokSetup: {
    setupInstructions:
      'Create or reuse a Supabase project and provide a Postgres connection string with permissions aligned to your workload.',
  },
});

export function registerSupabasePostgresIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(supabasePostgresIntegrationSpec);
}

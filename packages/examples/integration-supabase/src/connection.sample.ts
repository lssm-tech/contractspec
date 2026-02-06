import type { IntegrationConnection } from '@contractspec/lib.contracts/integrations/connection';

export const supabaseVectorConnection: IntegrationConnection = {
  meta: {
    id: 'conn-supabase-vector',
    tenantId: 'acme-knowledge',
    integrationKey: 'vectordb.supabase',
    integrationVersion: '1.0.0',
    label: 'Supabase Vector Store',
    environment: 'production',
    createdAt: '2026-02-06T00:00:00.000Z',
    updatedAt: '2026-02-06T00:00:00.000Z',
  },
  ownershipMode: 'managed',
  config: {
    schema: 'public',
    table: 'contractspec_vectors',
    createTableIfMissing: true,
    distanceMetric: 'cosine',
    maxConnections: 5,
    sslMode: 'require',
  },
  secretProvider: 'vault',
  secretRef: 'vault://integrations/acme-knowledge/conn-supabase-vector',
  status: 'connected',
};

export const supabaseDatabaseConnection: IntegrationConnection = {
  meta: {
    id: 'conn-supabase-db',
    tenantId: 'acme-knowledge',
    integrationKey: 'database.supabase',
    integrationVersion: '1.0.0',
    label: 'Supabase Postgres',
    environment: 'production',
    createdAt: '2026-02-06T00:00:00.000Z',
    updatedAt: '2026-02-06T00:00:00.000Z',
  },
  ownershipMode: 'managed',
  config: {
    maxConnections: 10,
    sslMode: 'require',
  },
  secretProvider: 'vault',
  secretRef: 'vault://integrations/acme-knowledge/conn-supabase-db',
  status: 'connected',
};

export const supabaseConnectionSamples: IntegrationConnection[] = [
  supabaseVectorConnection,
  supabaseDatabaseConnection,
];

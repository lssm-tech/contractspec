import { Pool } from 'pg';

import { PostgresChannelRuntimeStore } from '@contractspec/integration.runtime/channel';

export function createPostgresChannelRuntimeStore(
  databaseUrl: string
): PostgresChannelRuntimeStore {
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
  });
  return new PostgresChannelRuntimeStore(pool);
}

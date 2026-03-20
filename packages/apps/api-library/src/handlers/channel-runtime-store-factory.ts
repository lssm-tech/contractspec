import { PostgresChannelRuntimeStore } from '@contractspec/integration.runtime/channel';
import { Pool } from 'pg';

export function createPostgresChannelRuntimeStore(
	databaseUrl: string
): PostgresChannelRuntimeStore {
	const pool = new Pool({
		connectionString: databaseUrl,
		max: 5,
	});
	return new PostgresChannelRuntimeStore(pool);
}

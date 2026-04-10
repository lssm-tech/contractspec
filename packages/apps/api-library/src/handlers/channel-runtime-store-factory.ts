import { PostgresBuilderStore } from '@contractspec/integration.runtime';
import {
	InMemoryConnectReviewQueueStore,
	PostgresChannelRuntimeStore,
	PostgresConnectReviewQueueStore,
	PostgresExecutionLaneRuntimeStore,
} from '@contractspec/integration.runtime/channel';
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

export function createPostgresExecutionLaneRuntimeStore(
	databaseUrl: string
): PostgresExecutionLaneRuntimeStore {
	const pool = new Pool({
		connectionString: databaseUrl,
		max: 5,
	});
	return new PostgresExecutionLaneRuntimeStore(pool);
}

export function createPostgresBuilderStore(
	databaseUrl: string
): PostgresBuilderStore {
	const pool = new Pool({
		connectionString: databaseUrl,
		max: 5,
	});
	return new PostgresBuilderStore(pool);
}

export function createConnectReviewQueueStore(databaseUrl?: string) {
	if (!databaseUrl) {
		return new InMemoryConnectReviewQueueStore();
	}
	const pool = new Pool({
		connectionString: databaseUrl,
		max: 5,
	});
	return new PostgresConnectReviewQueueStore(pool);
}

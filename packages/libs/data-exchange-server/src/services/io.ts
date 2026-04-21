import type {
	ReconciliationPolicy,
	RecordBatch,
} from '@contractspec/lib.data-exchange-core';
import {
	readFileSource,
	readHttpSource,
	readSqlSource,
	readStorageSource,
	writeFileTarget,
	writeHttpTarget,
	writeSqlTarget,
	writeStorageTarget,
} from '../adapters';
import type {
	AdapterRegistry,
	ExecuteRunArgs,
	TargetWriteResult,
} from '../types';

function requireSqlClient(registry: AdapterRegistry, connection: string) {
	const client = registry.sqlClients?.[connection];
	if (!client) {
		throw new Error(`No SQL client registered for connection "${connection}".`);
	}
	return client;
}

function requireStorageClient(registry: AdapterRegistry, key: string) {
	const client = registry.storageClients?.[key];
	if (!client) {
		throw new Error(`No storage client registered for key "${key}".`);
	}
	return client;
}

export async function readSourceBatch(
	source: ExecuteRunArgs['source'],
	registry: AdapterRegistry = {}
): Promise<RecordBatch> {
	switch (source.kind) {
		case 'memory':
			return source.batch;
		case 'file':
			return readFileSource(source);
		case 'http':
			return readHttpSource(source, registry.fetch);
		case 'sql':
			return readSqlSource(
				source,
				requireSqlClient(registry, source.connection)
			);
		case 'storage':
			return readStorageSource(
				source,
				requireStorageClient(
					registry,
					`${source.provider ?? 'local'}:${source.bucket}`
				)
			);
	}
}

export async function writeTargetBatch(
	target: ExecuteRunArgs['target'],
	batch: RecordBatch,
	registry: AdapterRegistry = {},
	reconciliationPolicy: ReconciliationPolicy
): Promise<TargetWriteResult> {
	switch (target.kind) {
		case 'memory':
			return { written: batch.records.length, failed: 0, batch };
		case 'file':
			await writeFileTarget(target, batch);
			return { written: batch.records.length, failed: 0 };
		case 'http': {
			const result = await writeHttpTarget(target, batch, registry.fetch);
			return {
				written: result.written,
				failed: result.status >= 400 ? batch.records.length : 0,
				metadata: { status: result.status, body: result.body },
			};
		}
		case 'sql': {
			const result = await writeSqlTarget(
				target,
				batch,
				requireSqlClient(registry, target.connection),
				reconciliationPolicy
			);
			return {
				written: result.written,
				failed: result.failed ?? 0,
				metadata: { issues: result.issues },
			};
		}
		case 'storage':
			await writeStorageTarget(
				target,
				batch,
				requireStorageClient(
					registry,
					`${target.provider ?? 'local'}:${target.bucket}`
				)
			);
			return { written: batch.records.length, failed: 0 };
	}
}

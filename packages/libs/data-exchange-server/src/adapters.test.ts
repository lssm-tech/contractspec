import { describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRecordBatch } from '@contractspec/lib.data-exchange-core';
import {
	readFileSource,
	readHttpSource,
	readSqlSource,
	readStorageSource,
	writeFileTarget,
} from './adapters';
import type { SqlClient, StorageClient } from './types';

describe('data-exchange-server adapters', () => {
	it('reads and writes file sources', async () => {
		const dir = await mkdtemp(join(tmpdir(), 'data-exchange-server-'));
		const path = join(dir, 'accounts.json');
		const batch = createRecordBatch([{ id: '1', status: 'active' }], {
			format: 'json',
		});

		await writeFileTarget({ kind: 'file', path, format: 'json' }, batch);
		const raw = await readFile(path, 'utf-8');
		expect(raw).toContain('"status": "active"');

		const readBatch = await readFileSource({
			kind: 'file',
			path,
			format: 'json',
		});
		expect(readBatch.records[0]?.id).toBe('1');

		await rm(dir, { recursive: true, force: true });
	});

	it('uses injected http, sql, and storage clients', async () => {
		const fetchStub = (async () =>
			new Response(JSON.stringify([{ id: 'http-1' }]), {
				headers: { 'content-type': 'application/json' },
			})) as unknown as typeof fetch;
		const httpBatch = await readHttpSource(
			{ kind: 'http', url: 'https://example.test/data', format: 'json' },
			fetchStub
		);
		expect(httpBatch.records[0]?.id).toBe('http-1');

		const sqlClient: SqlClient = {
			query: async () => [{ id: 'sql-1' }],
			write: async () => ({ written: 1 }),
		};
		const sqlBatch = await readSqlSource(
			{ kind: 'sql', connection: 'primary', query: 'select 1' },
			sqlClient
		);
		expect(sqlBatch.records[0]?.id).toBe('sql-1');

		const storageClient: StorageClient = {
			getObject: async () => JSON.stringify([{ id: 'storage-1' }]),
			putObject: async () => undefined,
		};
		const storageBatch = await readStorageSource(
			{
				kind: 'storage',
				bucket: 'imports',
				objectKey: 'records.json',
				format: 'json',
			},
			storageClient
		);
		expect(storageBatch.records[0]?.id).toBe('storage-1');
	});
});

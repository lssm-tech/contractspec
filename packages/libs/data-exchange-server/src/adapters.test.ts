import { describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRecordBatch } from '@contractspec/lib.data-exchange-core';
import {
	readFileSource,
	readHttpSource,
	readSqlSource,
	readStorageSource,
	writeFileTarget,
	writeHttpTarget,
	writeStorageTarget,
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

	it('threads flexible codec options through file, http, and storage adapters', async () => {
		const dir = await mkdtemp(join(tmpdir(), 'data-exchange-codecs-'));
		const csvPath = join(dir, 'accounts.csv');
		await writeFile(csvPath, 'skip\nAccount ID;Status\nacc-1;active\n');

		const fileBatch = await readFileSource({
			kind: 'file',
			path: csvPath,
			format: 'csv',
			codecOptions: { csv: { delimiter: ';', skipRows: 1 } },
		});
		expect(fileBatch.records[0]?.['Account ID']).toBe('acc-1');

		await writeFileTarget(
			{
				kind: 'file',
				path: csvPath,
				format: 'csv',
				codecOptions: { csv: { delimiter: ';', columns: ['id', 'status'] } },
			},
			createRecordBatch([{ id: 'acc-2', status: 'paused' }])
		);
		expect(await readFile(csvPath, 'utf-8')).toContain('id;status');

		const httpBatch = await readHttpSource(
			{
				kind: 'http',
				url: 'https://example.test/data',
				format: 'json',
				codecOptions: { json: { recordsKey: 'rows', metadataKey: 'meta' } },
			},
			(async () =>
				new Response(
					JSON.stringify({
						meta: { source: 'http' },
						rows: [{ id: 'http-1' }],
					}),
					{ headers: { 'content-type': 'application/json' } }
				)) as unknown as typeof fetch
		);
		expect(httpBatch.metadata?.source).toBe('http');
		expect(httpBatch.records[0]?.id).toBe('http-1');

		let httpBody = '';
		await writeHttpTarget(
			{
				kind: 'http',
				url: 'https://example.test/data',
				format: 'json',
				codecOptions: { json: { recordsKey: 'rows', metadataKey: 'meta' } },
			},
			createRecordBatch([{ id: 'http-2' }], { metadata: { source: 'client' } }),
			(async (_url, init) => {
				httpBody = String(init?.body ?? '');
				return new Response('', { status: 200 });
			}) as typeof fetch
		);
		expect(JSON.parse(httpBody)).toEqual({
			meta: { source: 'client' },
			rows: [{ id: 'http-2' }],
		});

		let storageBody = '';
		const storageClient: StorageClient = {
			getObject: async () =>
				'<dataset><metadata><source>storage</source></metadata><row code="s-1"><status>active</status></row></dataset>',
			putObject: async ({ body }) => {
				storageBody = body;
			},
		};
		const storageBatch = await readStorageSource(
			{
				kind: 'storage',
				bucket: 'imports',
				objectKey: 'records.xml',
				format: 'xml',
				codecOptions: {
					xml: {
						rootTag: 'dataset',
						recordTag: 'row',
						metadataTag: 'metadata',
					},
				},
			},
			storageClient
		);
		expect(storageBatch.metadata?.source).toBe('storage');
		expect(storageBatch.records[0]?.code).toBe('s-1');

		await writeStorageTarget(
			{
				kind: 'storage',
				bucket: 'exports',
				objectKey: 'records.xml',
				format: 'xml',
				codecOptions: {
					xml: {
						rootTag: 'dataset',
						recordTag: 'row',
						attributeFields: ['code'],
						metadataTag: 'metadata',
					},
				},
			},
			createRecordBatch([{ code: 's-2', status: 'paused' }], {
				metadata: { source: 'server' },
			}),
			storageClient
		);
		expect(storageBody).toContain('<dataset>');
		expect(storageBody).toContain('<metadata>');
		expect(storageBody).toContain('<row code="s-2">');

		await rm(dir, { recursive: true, force: true });
	});
});

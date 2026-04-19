import {
	createRecordBatch,
	type ReconciliationPolicy,
	type RecordBatch,
	type SqlInterchangeSource,
	type SqlInterchangeTarget,
} from '@contractspec/lib.data-exchange-core';
import type { SqlClient, SqlWriteResult } from '../types';

export function readSqlSource(
	source: SqlInterchangeSource,
	client: SqlClient
): Promise<RecordBatch> {
	return client
		.query(source)
		.then((records) =>
			createRecordBatch(records, { name: source.name, format: 'json' })
		);
}

export function writeSqlTarget(
	target: SqlInterchangeTarget,
	batch: RecordBatch,
	client: SqlClient,
	reconciliationPolicy: ReconciliationPolicy
): Promise<SqlWriteResult> {
	return client.write({
		target,
		batch,
		reconciliationPolicy,
	});
}

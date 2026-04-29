import {
	formatCsvBatch,
	formatJsonBatch,
	formatXmlBatch,
	parseCsvContent,
	parseJsonContent,
	parseXmlContent,
	type RecordBatch,
	type StorageInterchangeSource,
	type StorageInterchangeTarget,
} from '@contractspec/lib.data-exchange-core';
import type { StorageClient } from '../types';

export async function readStorageSource(
	source: StorageInterchangeSource,
	client: StorageClient
): Promise<RecordBatch> {
	const body = await client.getObject(source);
	switch (source.format ?? 'json') {
		case 'csv':
			return parseCsvContent(body, {
				...source.codecOptions?.csv,
				name: source.name,
				metadata: source.metadata,
			});
		case 'xml':
			return parseXmlContent(body, {
				...source.codecOptions?.xml,
				name: source.name,
			});
		default:
			return parseJsonContent(body, {
				...source.codecOptions?.json,
				name: source.name,
				metadata: source.metadata,
			});
	}
}

export async function writeStorageTarget(
	target: StorageInterchangeTarget,
	batch: RecordBatch,
	client: StorageClient
): Promise<void> {
	const format = target.format ?? batch.format ?? 'json';
	const body =
		format === 'csv'
			? formatCsvBatch(batch, target.codecOptions?.csv)
			: format === 'xml'
				? formatXmlBatch(batch, target.codecOptions?.xml)
				: formatJsonBatch(batch, target.codecOptions?.json);
	await client.putObject({
		target,
		body,
		contentType:
			format === 'csv'
				? 'text/csv'
				: format === 'xml'
					? 'application/xml'
					: 'application/json',
	});
}

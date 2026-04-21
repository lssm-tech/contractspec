import { readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import {
	type FileInterchangeSource,
	type FileInterchangeTarget,
	formatCsvBatch,
	formatJsonBatch,
	formatXmlBatch,
	type InterchangeFormat,
	parseCsvContent,
	parseJsonContent,
	parseXmlContent,
	type RecordBatch,
} from '@contractspec/lib.data-exchange-core';
import type { FileWriteResult } from '../types';

function resolveFileFormat(
	path: string,
	explicit?: InterchangeFormat
): InterchangeFormat {
	if (explicit) {
		return explicit;
	}
	switch (extname(path).toLowerCase()) {
		case '.csv':
			return 'csv';
		case '.xml':
			return 'xml';
		default:
			return 'json';
	}
}

export async function readFileSource(
	source: FileInterchangeSource
): Promise<RecordBatch> {
	const content = await readFile(source.path, source.encoding ?? 'utf-8');
	const format = resolveFileFormat(source.path, source.format);
	switch (format) {
		case 'csv':
			return parseCsvContent(content, {
				name: source.name,
				metadata: source.metadata,
			});
		case 'xml':
			return parseXmlContent(content, { name: source.name });
		default:
			return parseJsonContent(content, {
				name: source.name,
				metadata: source.metadata,
			});
	}
}

export async function writeFileTarget(
	target: FileInterchangeTarget,
	batch: RecordBatch
): Promise<FileWriteResult> {
	const format = resolveFileFormat(target.path, target.format ?? batch.format);
	const body =
		format === 'csv'
			? formatCsvBatch(batch)
			: format === 'xml'
				? formatXmlBatch(batch)
				: formatJsonBatch(batch);
	await writeFile(target.path, body, 'utf-8');
	return {
		path: target.path,
		written: batch.records.length,
	};
}

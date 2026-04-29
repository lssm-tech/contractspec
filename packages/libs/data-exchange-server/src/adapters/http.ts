import {
	formatCsvBatch,
	formatJsonBatch,
	formatXmlBatch,
	type HttpInterchangeSource,
	type HttpInterchangeTarget,
	type InterchangeFormat,
	parseCsvContent,
	parseJsonContent,
	parseXmlContent,
	type RecordBatch,
} from '@contractspec/lib.data-exchange-core';
import type { HttpWriteResult } from '../types';

function detectHttpFormat(
	contentType: string | null,
	fallback?: InterchangeFormat
) {
	if (fallback) return fallback;
	if (contentType?.includes('csv')) return 'csv';
	if (contentType?.includes('xml')) return 'xml';
	return 'json';
}

export async function readHttpSource(
	source: HttpInterchangeSource,
	fetchImpl: typeof fetch = fetch
): Promise<RecordBatch> {
	const response = await fetchImpl(source.url, {
		method: source.method ?? 'GET',
		headers: source.headers,
		body: source.body ? JSON.stringify(source.body) : undefined,
	});
	const body = await response.text();
	const format = detectHttpFormat(
		response.headers.get('content-type'),
		source.format
	);
	switch (format) {
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

export async function writeHttpTarget(
	target: HttpInterchangeTarget,
	batch: RecordBatch,
	fetchImpl: typeof fetch = fetch
): Promise<HttpWriteResult> {
	const format = target.format ?? batch.format ?? 'json';
	const body =
		format === 'csv'
			? formatCsvBatch(batch, target.codecOptions?.csv)
			: format === 'xml'
				? formatXmlBatch(batch, target.codecOptions?.xml)
				: formatJsonBatch(batch, target.codecOptions?.json);
	const contentType =
		format === 'csv'
			? 'text/csv'
			: format === 'xml'
				? 'application/xml'
				: 'application/json';
	const response = await fetchImpl(target.url, {
		method: target.method ?? 'POST',
		headers: {
			'content-type': contentType,
			...target.headers,
		},
		body,
	});

	return {
		status: response.status,
		body: await response.text(),
		written: batch.records.length,
	};
}

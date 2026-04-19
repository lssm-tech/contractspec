import { createRecordBatch, flattenRecord } from '../records';
import type { InterchangeRecord, RecordBatch } from '../types';

function parseCsvRows(content: string): string[][] {
	const rows: string[][] = [];
	let currentCell = '';
	let currentRow: string[] = [];
	let inQuotes = false;

	for (let index = 0; index < content.length; index += 1) {
		const char = content[index]!;
		const next = content[index + 1];

		if (char === '"') {
			if (inQuotes && next === '"') {
				currentCell += '"';
				index += 1;
				continue;
			}
			inQuotes = !inQuotes;
			continue;
		}

		if (!inQuotes && char === ',') {
			currentRow.push(currentCell);
			currentCell = '';
			continue;
		}

		if (!inQuotes && (char === '\n' || char === '\r')) {
			if (char === '\r' && next === '\n') {
				index += 1;
			}
			currentRow.push(currentCell);
			if (currentRow.some((value) => value.length > 0)) {
				rows.push(currentRow);
			}
			currentCell = '';
			currentRow = [];
			continue;
		}

		currentCell += char;
	}

	currentRow.push(currentCell);
	if (currentRow.some((value) => value.length > 0)) {
		rows.push(currentRow);
	}

	return rows;
}

function escapeCsv(value: unknown): string {
	const normalized =
		value === undefined || value === null
			? ''
			: typeof value === 'string'
				? value
				: JSON.stringify(value);

	if (
		normalized.includes(',') ||
		normalized.includes('"') ||
		normalized.includes('\n')
	) {
		return `"${normalized.replace(/"/g, '""')}"`;
	}
	return normalized;
}

export function parseCsvContent(
	content: string,
	options: Pick<RecordBatch, 'name' | 'metadata'> = {}
): RecordBatch {
	const rows = parseCsvRows(content.trim());
	const [header = [], ...dataRows] = rows;
	const records: InterchangeRecord[] = dataRows.map((row) =>
		Object.fromEntries(header.map((key, index) => [key, row[index] ?? '']))
	);

	return createRecordBatch(records, {
		name: options.name,
		metadata: options.metadata,
		format: 'csv',
	});
}

export function formatCsvBatch(
	batch: RecordBatch,
	options: { columns?: string[] } = {}
): string {
	const flattenedRows = batch.records.map((record) => flattenRecord(record));
	const columns =
		options.columns ??
		(batch.columns.length > 0
			? batch.columns.map((column) => column.key)
			: Array.from(
					new Set(flattenedRows.flatMap((record) => Object.keys(record)))
				).sort());

	const lines = [
		columns.join(','),
		...flattenedRows.map((row) =>
			columns.map((column) => escapeCsv(row[column])).join(',')
		),
	];

	return lines.join('\n');
}

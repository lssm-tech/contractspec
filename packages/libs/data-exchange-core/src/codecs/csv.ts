import { createRecordBatch, flattenRecord } from '../records';
import type { CsvCodecOptions, InterchangeRecord, RecordBatch } from '../types';

export type { CsvCodecOptions } from '../types';

function parseCsvRows(
	content: string,
	options: CsvCodecOptions = {}
): string[][] {
	const rows: string[][] = [];
	const delimiter = options.delimiter ?? ',';
	const quote = options.quote ?? '"';
	let currentCell = '';
	let currentRow: string[] = [];
	let inQuotes = false;

	for (let index = 0; index < content.length; index += 1) {
		const char = content[index]!;
		const next = content[index + 1];

		if (char === quote) {
			if (inQuotes && next === quote) {
				currentCell += quote;
				index += 1;
				continue;
			}
			inQuotes = !inQuotes;
			continue;
		}

		if (!inQuotes && char === delimiter) {
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

function escapeDelimited(
	value: unknown,
	delimiter: string,
	quote: string
): string {
	const normalized =
		value === undefined || value === null
			? ''
			: typeof value === 'string'
				? value
				: JSON.stringify(value);

	if (
		normalized.includes(delimiter) ||
		normalized.includes(quote) ||
		normalized.includes('\n')
	) {
		return `${quote}${normalized.split(quote).join(`${quote}${quote}`)}${quote}`;
	}
	return normalized;
}

export function parseCsvContent(
	content: string,
	options: Pick<RecordBatch, 'name' | 'metadata'> & CsvCodecOptions = {}
): RecordBatch {
	const rows = parseCsvRows(content.trim(), options).slice(
		options.skipRows ?? 0
	);
	const headerRow = options.headerRow ?? (options.columns ? -1 : 0);
	const header =
		options.columns ?? (headerRow >= 0 ? rows[headerRow] : []) ?? [];
	const dataRows = headerRow >= 0 ? rows.slice(headerRow + 1) : rows;
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
	options: CsvCodecOptions = {}
): string {
	const delimiter = options.delimiter ?? ',';
	const quote = options.quote ?? '"';
	const flattenedRows = batch.records.map((record) => flattenRecord(record));
	const columns =
		options.columns ??
		(batch.columns.length > 0
			? batch.columns.map((column) => column.key)
			: Array.from(
					new Set(flattenedRows.flatMap((record) => Object.keys(record)))
				).sort());

	const lines = [
		columns
			.map((column) => escapeDelimited(column, delimiter, quote))
			.join(delimiter),
		...flattenedRows.map((row) =>
			columns
				.map((column) => escapeDelimited(row[column], delimiter, quote))
				.join(delimiter)
		),
	];

	return lines.join('\n');
}

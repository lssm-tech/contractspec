import type {
	InterchangeColumn,
	InterchangeColumnType,
	InterchangeRecord,
	RecordBatch,
} from '../types';
import { flattenRecord } from './flatten';
import { isPlainObject } from './path';

function detectColumnType(value: unknown): InterchangeColumnType {
	if (value === null) return 'null';
	if (value instanceof Date) return 'date';
	if (typeof value === 'string') {
		if (value.trim() === '') return 'string';
		const asNumber = Number(value);
		if (!Number.isNaN(asNumber) && value.trim() !== '') {
			return 'number';
		}
		if (['true', 'false'].includes(value.toLowerCase())) {
			return 'boolean';
		}
		const asDate = Date.parse(value);
		if (!Number.isNaN(asDate) && value.includes('-')) {
			return 'date';
		}
		return 'string';
	}
	if (typeof value === 'number') return 'number';
	if (typeof value === 'boolean') return 'boolean';
	if (Array.isArray(value) || isPlainObject(value)) return 'json';
	return 'unknown';
}

function collectColumns(records: InterchangeRecord[]): InterchangeColumn[] {
	const sampleByColumn = new Map<string, string[]>();
	const typeByColumn = new Map<string, InterchangeColumnType>();
	const nullableColumns = new Set<string>();

	for (const record of records) {
		const flattened = flattenRecord(record);
		for (const [key, value] of Object.entries(flattened)) {
			const detectedType = detectColumnType(value);
			if (!typeByColumn.has(key) || typeByColumn.get(key) === 'null') {
				typeByColumn.set(key, detectedType);
			}
			if (value === null || value === undefined || value === '') {
				nullableColumns.add(key);
			}
			const serializedSample =
				typeof value === 'string' ? value : JSON.stringify(value);
			const existingSamples = sampleByColumn.get(key) ?? [];
			if (
				serializedSample !== undefined &&
				existingSamples.length < 3 &&
				!existingSamples.includes(serializedSample)
			) {
				existingSamples.push(serializedSample);
				sampleByColumn.set(key, existingSamples);
			}
		}
	}

	return Array.from(typeByColumn.entries())
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([key, detectedType]) => ({
			key,
			label: key,
			sourcePath: key,
			detectedType,
			nullable: nullableColumns.has(key),
			sampleValues: sampleByColumn.get(key) ?? [],
		}));
}

export function createRecordBatch(
	records: InterchangeRecord[],
	options: Pick<RecordBatch, 'format' | 'metadata' | 'name'> = {}
): RecordBatch {
	return {
		name: options.name,
		format: options.format,
		metadata: options.metadata,
		records,
		columns: collectColumns(records),
	};
}

import { createRecordBatch } from '../records';
import type { InterchangeRecord, JsonValue, RecordBatch } from '../types';

function toRecords(value: JsonValue): InterchangeRecord[] {
	if (Array.isArray(value)) {
		return value.map((item) =>
			typeof item === 'object' && item !== null && !Array.isArray(item)
				? (item as InterchangeRecord)
				: { value: item }
		);
	}
	if (typeof value === 'object' && value !== null) {
		const items = value.items;
		if (Array.isArray(items)) {
			return items.map((item) => item as InterchangeRecord);
		}
		return [value as InterchangeRecord];
	}
	return [{ value }];
}

export interface JsonCodecOptions {
	pretty?: boolean;
	recordsKey?: string;
	metadataKey?: string;
}

export function parseJsonContent(
	content: string,
	options: Pick<RecordBatch, 'name' | 'metadata'> = {}
): RecordBatch {
	const parsed = JSON.parse(content) as JsonValue;
	return createRecordBatch(toRecords(parsed), {
		name: options.name,
		metadata: options.metadata,
		format: 'json',
	});
}

export function formatJsonBatch(
	batch: RecordBatch,
	options: JsonCodecOptions = {}
): string {
	const payload =
		options.recordsKey || options.metadataKey
			? {
					...(options.metadataKey
						? { [options.metadataKey]: batch.metadata ?? {} }
						: {}),
					[(options.recordsKey ?? 'records') as string]: batch.records,
				}
			: batch.records;
	return JSON.stringify(payload, null, options.pretty === false ? 0 : 2);
}

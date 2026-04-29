import { createRecordBatch } from '../records';
import type {
	InterchangeRecord,
	JsonCodecOptions,
	JsonValue,
	RecordBatch,
} from '../types';

export type { JsonCodecOptions } from '../types';

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

export function parseJsonContent(
	content: string,
	options: Pick<RecordBatch, 'name' | 'metadata'> & JsonCodecOptions = {}
): RecordBatch {
	const parsed = JSON.parse(content) as JsonValue;
	const recordsPayload =
		options.recordsKey &&
		typeof parsed === 'object' &&
		parsed !== null &&
		!Array.isArray(parsed)
			? parsed[options.recordsKey]
			: parsed;
	const metadata =
		options.metadataKey &&
		typeof parsed === 'object' &&
		parsed !== null &&
		!Array.isArray(parsed) &&
		typeof parsed[options.metadataKey] === 'object' &&
		parsed[options.metadataKey] !== null &&
		!Array.isArray(parsed[options.metadataKey])
			? (parsed[options.metadataKey] as Record<string, JsonValue | undefined>)
			: options.metadata;
	return createRecordBatch(toRecords(recordsPayload ?? []), {
		name: options.name,
		metadata,
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

import type { InterchangeRecord, InterchangeValue } from '../types';
import { isPlainObject, setValueAtPath } from './path';

function flattenValue(
	value: unknown,
	currentPath: string,
	output: InterchangeRecord
): void {
	if (isPlainObject(value)) {
		for (const [key, nested] of Object.entries(value)) {
			flattenValue(nested, currentPath ? `${currentPath}.${key}` : key, output);
		}
		return;
	}

	output[currentPath] = value as InterchangeValue;
}

export function flattenRecord(record: InterchangeRecord): InterchangeRecord {
	const flattened: InterchangeRecord = {};

	for (const [key, value] of Object.entries(record)) {
		flattenValue(value, key, flattened);
	}

	return flattened;
}

export function unflattenRecord(record: InterchangeRecord): InterchangeRecord {
	const rebuilt: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(record)) {
		setValueAtPath(rebuilt, key, value);
	}
	return rebuilt as InterchangeRecord;
}

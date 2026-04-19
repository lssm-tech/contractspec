import type { InterchangeRecord } from '../types';

export function isPlainObject(
	value: unknown
): value is Record<string, unknown> {
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value) &&
		!(value instanceof Date)
	);
}

export function getValueAtPath(
	record: InterchangeRecord | Record<string, unknown>,
	path: string
): unknown {
	return path
		.split('.')
		.filter(Boolean)
		.reduce<unknown>((current, segment) => {
			if (!isPlainObject(current)) {
				return undefined;
			}
			return current[segment];
		}, record);
}

export function setValueAtPath(
	record: Record<string, unknown>,
	path: string,
	value: unknown
): void {
	const segments = path.split('.').filter(Boolean);
	if (segments.length === 0) {
		return;
	}

	let current: Record<string, unknown> = record;
	for (const segment of segments.slice(0, -1)) {
		const existing = current[segment];
		if (!isPlainObject(existing)) {
			current[segment] = {};
		}
		current = current[segment] as Record<string, unknown>;
	}

	current[segments[segments.length - 1]!] = value;
}

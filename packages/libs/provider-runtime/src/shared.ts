import type { RuntimeMode } from '@contractspec/lib.provider-spec';
import { createHash } from 'crypto';

export function createDeterministicHash(input: string) {
	return createHash('sha256').update(input).digest('hex');
}

export function readStringArray(value: unknown): string[] {
	return Array.isArray(value)
		? value.filter((item): item is string => typeof item === 'string')
		: [];
}

export function readRuntimeMode(
	value: unknown,
	fallback: RuntimeMode = 'managed'
): RuntimeMode {
	return value === 'local' || value === 'hybrid' || value === 'managed'
		? value
		: fallback;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

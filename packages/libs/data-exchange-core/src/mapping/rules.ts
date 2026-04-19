import { getValueAtPath, setValueAtPath } from '../records/path';
import type { FieldMapping, InterchangeRecord, MappingRule } from '../types';

function parseBoolean(value: unknown): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value !== 0;
	if (typeof value === 'string') {
		return ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
	}
	return Boolean(value);
}

function applyRule(value: unknown, rule: MappingRule): unknown {
	switch (rule.kind) {
		case 'trim':
			return typeof value === 'string' ? value.trim() : value;
		case 'uppercase':
			return typeof value === 'string' ? value.toUpperCase() : value;
		case 'lowercase':
			return typeof value === 'string' ? value.toLowerCase() : value;
		case 'json-parse':
			return typeof value === 'string' ? JSON.parse(value) : value;
		case 'json-stringify':
			return typeof value === 'string' ? value : JSON.stringify(value);
		case 'number':
			return typeof value === 'number' ? value : Number(value);
		case 'boolean':
			return parseBoolean(value);
		case 'date':
			return value instanceof Date ? value : new Date(String(value));
		case 'string':
			return typeof value === 'string' ? value : String(value ?? '');
		case 'constant':
			return rule.value;
		case 'default':
			return value === undefined || value === null || value === ''
				? rule.value
				: value;
		case 'split':
			return typeof value === 'string' ? value.split(rule.delimiter) : value;
		case 'join':
			return Array.isArray(value) ? value.join(rule.delimiter) : value;
	}
}

export function applyMappingToRecord(
	record: InterchangeRecord,
	mappings: FieldMapping[]
): InterchangeRecord {
	const output: Record<string, unknown> = {};

	for (const mapping of mappings) {
		let value = getValueAtPath(record, mapping.sourceField);
		for (const rule of mapping.rules ?? []) {
			value = applyRule(value, rule);
		}
		setValueAtPath(output, mapping.targetField, value);
	}

	return output as InterchangeRecord;
}

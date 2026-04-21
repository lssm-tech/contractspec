import {
	type AnySchemaModel,
	isSchemaModel,
	type SchemaFieldConfig,
} from '@contractspec/lib.schema';
import { getValueAtPath, isPlainObject, setValueAtPath } from '../records/path';
import type { InterchangeRecord, ValidationIssue } from '../types';

function coercePrimitive(value: unknown, expectedType: string): unknown {
	if (value === undefined || value === null || value === '') {
		return value;
	}

	switch (expectedType) {
		case 'ZodNumber':
			return typeof value === 'number' ? value : Number(value);
		case 'ZodBoolean':
			if (typeof value === 'boolean') return value;
			if (typeof value === 'string') {
				return ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
			}
			return Boolean(value);
		case 'ZodDate':
			return value instanceof Date ? value : new Date(String(value));
		case 'ZodArray':
			if (Array.isArray(value)) return value;
			if (typeof value === 'string') {
				return value.includes(',')
					? value.split(',').map((item) => item.trim())
					: [value];
			}
			return [value];
		case 'ZodObject':
			return typeof value === 'string' ? JSON.parse(value) : value;
		default:
			return typeof value === 'string' ? value : String(value);
	}
}

function zodTypeName(field: SchemaFieldConfig['type']): string {
	const constructorName = field.getZod()?.constructor?.name;
	return constructorName ?? 'ZodString';
}

function coerceFieldValue(
	value: unknown,
	fieldConfig: SchemaFieldConfig
): unknown {
	if (isSchemaModel(fieldConfig.type) && isPlainObject(value)) {
		return coerceRecordToSchema(value as InterchangeRecord, fieldConfig.type)
			.record;
	}
	return coercePrimitive(value, zodTypeName(fieldConfig.type));
}

export function coerceRecordToSchema(
	record: InterchangeRecord,
	schema: AnySchemaModel
): { record: InterchangeRecord; issues: ValidationIssue[] } {
	if (!isSchemaModel(schema)) {
		const parsed = schema.getZod().safeParse(record);
		return {
			record: parsed.success ? (parsed.data as InterchangeRecord) : record,
			issues: parsed.success
				? []
				: parsed.error.issues.map((issue) => ({
						severity: 'error' as const,
						code: 'schema.validation',
						message: issue.message,
						fieldPath: issue.path.join('.'),
					})),
		};
	}

	const output: Record<string, unknown> = {};
	const issues: ValidationIssue[] = [];

	for (const [fieldKey, fieldConfig] of Object.entries(schema.config.fields)) {
		const rawValue = getValueAtPath(record, fieldKey);
		if (rawValue === undefined && !fieldConfig.isOptional) {
			issues.push({
				severity: 'error',
				code: 'schema.required',
				message: `Missing required field ${fieldKey}.`,
				fieldPath: fieldKey,
			});
			continue;
		}

		try {
			const coercedValue = fieldConfig.isArray
				? ([] as unknown[]).concat(coerceFieldValue(rawValue, fieldConfig))
				: coerceFieldValue(rawValue, fieldConfig);
			setValueAtPath(output, fieldKey, coercedValue);
		} catch (error) {
			issues.push({
				severity: 'error',
				code: 'schema.coercion',
				message:
					error instanceof Error
						? error.message
						: `Failed to coerce ${fieldKey}.`,
				fieldPath: fieldKey,
				actualValue: rawValue,
			});
		}
	}

	const parsed = schema.getZod().safeParse(output);
	if (!parsed.success) {
		issues.push(
			...parsed.error.issues.map((issue) => ({
				severity: 'error' as const,
				code: 'schema.validation',
				message: issue.message,
				fieldPath: issue.path.join('.'),
			}))
		);
	}

	return {
		record: (parsed.success ? parsed.data : output) as InterchangeRecord,
		issues,
	};
}

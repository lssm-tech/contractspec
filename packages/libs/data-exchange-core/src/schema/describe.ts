import { type AnySchemaModel, isSchemaModel } from '@contractspec/lib.schema';
import type { InterchangeColumn } from '../types';

export function describeSchemaFields(
	schema: AnySchemaModel
): InterchangeColumn[] {
	if (!isSchemaModel(schema)) {
		return [];
	}

	return Object.entries(schema.config.fields).map(([key, config]) => ({
		key,
		label: key,
		sourcePath: key,
		detectedType: config.isArray ? 'json' : 'unknown',
		nullable: config.isOptional,
		sampleValues: [],
	}));
}

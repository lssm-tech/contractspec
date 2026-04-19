import type { AnySchemaModel } from '@contractspec/lib.schema';
import { isSchemaModel } from '@contractspec/lib.schema';
import type { FieldMapping, RecordBatch } from '../types';

function normalizeKey(value: string): string {
	return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function scoreMatch(sourceKey: string, targetKey: string): number {
	if (sourceKey === targetKey) return 1;
	const normalizedSource = normalizeKey(sourceKey);
	const normalizedTarget = normalizeKey(targetKey);
	if (normalizedSource === normalizedTarget) return 0.92;
	if (
		normalizedSource.includes(normalizedTarget) ||
		normalizedTarget.includes(normalizedSource)
	) {
		return 0.75;
	}
	return 0;
}

export function inferFieldMappings(
	batch: RecordBatch,
	schema: AnySchemaModel
): FieldMapping[] {
	if (!isSchemaModel(schema)) {
		return batch.columns.map((column) => ({
			sourceField: column.key,
			targetField: column.key,
			confidence: 0.5,
		}));
	}

	const sourceKeys = batch.columns.map((column) => column.key);
	const targetKeys = Object.keys(schema.config.fields);
	const mappings: FieldMapping[] = [];

	for (const targetKey of targetKeys) {
		const bestMatch = sourceKeys
			.map((sourceKey) => ({
				sourceKey,
				score: scoreMatch(sourceKey, targetKey),
			}))
			.sort((left, right) => right.score - left.score)[0];

		if (!bestMatch || bestMatch.score === 0) {
			continue;
		}

		mappings.push({
			sourceField: bestMatch.sourceKey,
			targetField: targetKey,
			required: !schema.config.fields[targetKey]?.isOptional,
			confidence: bestMatch.score,
			notes:
				bestMatch.score < 1
					? [`Inferred from ${bestMatch.sourceKey} -> ${targetKey}.`]
					: undefined,
		});
	}

	return mappings;
}

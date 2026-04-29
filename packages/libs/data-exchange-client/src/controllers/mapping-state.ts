import type { FieldMapping } from '@contractspec/lib.data-exchange-core';
import type { UseDataExchangeControllerOptions } from '../types';

export function createMappingFromTemplate(
	preview: UseDataExchangeControllerOptions['preview'],
	targetField: string,
	next: Partial<FieldMapping>
): FieldMapping {
	const templateColumn = preview.plan.template?.columns.find(
		(column) => column.targetField === targetField
	);
	return {
		sourceField: next.sourceField ?? '',
		targetField,
		required: templateColumn?.required,
		sourceAliases: templateColumn?.sourceAliases,
		format: next.format ?? templateColumn?.format,
		templateColumnKey: templateColumn?.key,
		status: 'manual',
		...next,
	};
}

export function upsertMapping(
	current: FieldMapping[],
	preview: UseDataExchangeControllerOptions['preview'],
	targetField: string,
	next: Partial<FieldMapping>
): FieldMapping[] {
	if (!current.some((mapping) => mapping.targetField === targetField)) {
		return [...current, createMappingFromTemplate(preview, targetField, next)];
	}
	return current.map((mapping) =>
		mapping.targetField === targetField ? { ...mapping, ...next } : mapping
	);
}

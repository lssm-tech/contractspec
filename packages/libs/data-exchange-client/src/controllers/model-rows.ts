import type {
	FieldMapping,
	FormatProfile,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';
import type { MappingRow, TemplateMappingRow } from '../types';

export function formatLabel(mapping: FieldMapping): string | undefined {
	if (!mapping.format) return undefined;
	const details = [
		mapping.format.decimalSeparator
			? `decimal ${mapping.format.decimalSeparator}`
			: undefined,
		mapping.format.thousandsSeparator
			? `thousands ${mapping.format.thousandsSeparator}`
			: undefined,
		mapping.format.inputFormats?.length
			? mapping.format.inputFormats.join('|')
			: undefined,
		mapping.format.delimiter
			? `delimiter ${mapping.format.delimiter}`
			: undefined,
	].filter(Boolean);
	return details.length > 0
		? `${mapping.format.kind} (${details.join(', ')})`
		: mapping.format.kind;
}

export function createMappingRows(mappings: FieldMapping[]): MappingRow[] {
	return mappings.map((mapping: FieldMapping, index: number) => ({
		id: `${mapping.targetField}-${index}`,
		sourceField: mapping.sourceField,
		targetField: mapping.targetField,
		confidence: mapping.confidence,
		required: mapping.required,
		sourceAliases: mapping.sourceAliases,
		formatLabel: formatLabel(mapping),
		templateColumnKey: mapping.templateColumnKey,
		status: mapping.status,
	}));
}

export function createTemplateRows(args: {
	preview: PreviewResult;
	mappings: FieldMapping[];
	mappingRows: MappingRow[];
	formatProfile?: FormatProfile;
	ignoredSourceColumns: string[];
}): TemplateMappingRow[] {
	return (args.preview.plan.template?.columns ?? []).map((column, index) => {
		const mapping = args.mappings.find(
			(candidate) =>
				candidate.templateColumnKey === column.key ||
				candidate.targetField === column.targetField
		);
		const row = args.mappingRows.find(
			(candidate) =>
				candidate.templateColumnKey === column.key ||
				candidate.targetField === column.targetField
		);
		return {
			id: `${column.key}-${index}`,
			sourceField: row?.sourceField ?? '',
			targetField: column.targetField,
			confidence: row?.confidence,
			required: column.required,
			sourceAliases: column.sourceAliases,
			formatLabel:
				row?.formatLabel ??
				formatLabel({
					sourceField: '',
					targetField: column.targetField,
					format:
						args.formatProfile?.columns?.[column.targetField] ??
						args.formatProfile?.columns?.[column.key] ??
						column.format,
				}),
			templateColumnKey: column.key,
			status: row?.status ?? 'unmatched',
			label: column.label,
			description: column.description,
			unmatched: !mapping,
			ignoredSource: row?.sourceField
				? args.ignoredSourceColumns.includes(row.sourceField)
				: false,
		};
	});
}

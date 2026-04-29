import type {
	FieldMapping,
	FormatProfile,
	RecordBatch,
	TemplateMappingResult,
} from '../types';

export function applyMappingFormats(
	mappings: FieldMapping[],
	formatProfile?: FormatProfile
): FieldMapping[] {
	return mappings.map((mapping) => ({
		...mapping,
		format:
			mapping.format ??
			formatProfile?.columns?.[mapping.targetField] ??
			(mapping.templateColumnKey
				? formatProfile?.columns?.[mapping.templateColumnKey]
				: undefined) ??
			formatProfile?.defaultFormat,
		status: mapping.status ?? 'inferred',
	}));
}

export function createInferredMappingResult(
	batch: RecordBatch,
	mappings: FieldMapping[]
): TemplateMappingResult {
	return {
		mappings,
		issues: [],
		matchedColumns: [],
		unmatchedTemplateColumns: [],
		unmatchedSourceColumns: batch.columns.filter(
			(column) =>
				!mappings.some((mapping) => mapping.sourceField === column.key)
		),
		source: 'inferred',
	};
}

export function appendInferredMappings(args: {
	mappings: FieldMapping[];
	inferredMappings: FieldMapping[];
	usedSourceFields: Set<string>;
	formatProfile?: FormatProfile;
}): void {
	const usedTargets = new Set(
		args.mappings.map((mapping) => mapping.targetField)
	);
	for (const inferred of args.inferredMappings) {
		if (
			usedTargets.has(inferred.targetField) ||
			args.usedSourceFields.has(inferred.sourceField)
		) {
			continue;
		}
		args.usedSourceFields.add(inferred.sourceField);
		args.mappings.push({
			...inferred,
			format:
				inferred.format ??
				args.formatProfile?.columns?.[inferred.targetField] ??
				(inferred.templateColumnKey
					? args.formatProfile?.columns?.[inferred.templateColumnKey]
					: undefined) ??
				args.formatProfile?.defaultFormat,
			status: 'inferred',
		});
	}
}

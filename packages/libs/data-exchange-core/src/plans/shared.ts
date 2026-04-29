import type { AnySchemaModel } from '@contractspec/lib.schema';
import { inferFieldMappings, resolveTemplateMappings } from '../mapping';
import { applyMappingFormats } from '../mapping/template-results';
import type {
	DataExchangeTemplate,
	FieldMapping,
	FormatProfile,
	ReconciliationPolicy,
	RecordBatch,
	TemplateMappingResult,
	ValidationIssue,
} from '../types';

export const defaultReconciliationPolicy: ReconciliationPolicy = {
	keyFields: ['id'],
	onMissing: 'create',
	onMatch: 'update',
	onExtra: 'ignore',
};

export function createPlanIssues(mappings: FieldMapping[]): ValidationIssue[] {
	const lowConfidenceMappings = mappings.filter(
		(mapping) => (mapping.confidence ?? 1) < 0.8
	);

	return lowConfidenceMappings.map((mapping) => ({
		severity: 'warning',
		code: 'mapping.low-confidence',
		message: `Low confidence mapping for ${mapping.sourceField} -> ${mapping.targetField}.`,
		fieldPath: mapping.targetField,
	}));
}

export function resolvePlanMappings(args: {
	sourceBatch: RecordBatch;
	schema: AnySchemaModel;
	mappings?: FieldMapping[];
	template?: DataExchangeTemplate;
	formatProfile?: FormatProfile;
}): TemplateMappingResult {
	if (args.mappings) {
		const mappings = args.mappings.map((mapping) => ({
			...mapping,
			format:
				mapping.format ??
				args.formatProfile?.columns?.[mapping.targetField] ??
				(mapping.templateColumnKey
					? args.formatProfile?.columns?.[mapping.templateColumnKey]
					: undefined) ??
				args.formatProfile?.defaultFormat,
			status: mapping.status ?? 'manual',
		}));
		return {
			mappings,
			issues: [],
			matchedColumns: [],
			unmatchedTemplateColumns: [],
			unmatchedSourceColumns: args.sourceBatch.columns.filter(
				(column) =>
					!mappings.some((mapping) => mapping.sourceField === column.key)
			),
			source: 'explicit',
		};
	}
	if (args.template) {
		return resolveTemplateMappings({
			batch: args.sourceBatch,
			schema: args.schema,
			template: args.template,
			formatProfile: args.formatProfile,
		});
	}

	const mappings = applyMappingFormats(
		inferFieldMappings(args.sourceBatch, args.schema),
		args.formatProfile
	);
	return {
		mappings,
		issues: [],
		matchedColumns: [],
		unmatchedTemplateColumns: [],
		unmatchedSourceColumns: args.sourceBatch.columns.filter(
			(column) =>
				!mappings.some((mapping) => mapping.sourceField === column.key)
		),
		source: 'inferred',
	};
}

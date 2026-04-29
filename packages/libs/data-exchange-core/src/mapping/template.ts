import { isSchemaModel } from '@contractspec/lib.schema';
import type {
	FieldMapping,
	ImportTemplateColumn,
	ResolveImportTemplateMappingsArgs,
	TemplateColumnMatch,
	TemplateMappingResult,
	ValidationIssue,
} from '../types';
import { inferFieldMappings } from './infer';
import {
	createRequiredMappingIssue,
	createSchemaMatch,
	createTemplateFieldMapping,
} from './template-builders';
import { validateDataExchangeTemplate } from './template-define';
import { findTemplateMatch } from './template-matchers';
import {
	appendInferredMappings,
	applyMappingFormats,
	createInferredMappingResult,
} from './template-results';

export * from './template-define';

export function resolveTemplateMappings(
	args: ResolveImportTemplateMappingsArgs
): TemplateMappingResult {
	if (!args.template || args.template.columns.length === 0) {
		return createInferredMappingResult(
			args.batch,
			applyMappingFormats(
				inferFieldMappings(args.batch, args.schema),
				args.formatProfile
			)
		);
	}

	const template = validateDataExchangeTemplate(args.template);
	const usedSourceFields = new Set<string>();
	const matchedColumns: TemplateColumnMatch[] = [];
	const unmatchedTemplateColumns: ImportTemplateColumn[] = [];
	const issues: ValidationIssue[] = [];
	const inferredMappings = isSchemaModel(args.schema)
		? inferFieldMappings(args.batch, args.schema)
		: [];
	const inferredByTarget = new Map(
		inferredMappings.map((mapping) => [mapping.targetField, mapping])
	);
	const mappings: FieldMapping[] = [];
	const formatProfile = args.formatProfile ?? template.formatProfile;

	for (const templateColumn of template.columns) {
		const directMatch = findTemplateMatch(
			templateColumn,
			args.batch.columns,
			usedSourceFields
		);
		const fallback = inferredByTarget.get(templateColumn.targetField);
		const match =
			directMatch ??
			(fallback && !usedSourceFields.has(fallback.sourceField)
				? createSchemaMatch(templateColumn, fallback)
				: null);

		if (!match) {
			unmatchedTemplateColumns.push(templateColumn);
			if (templateColumn.required) {
				issues.push(createRequiredMappingIssue(templateColumn));
			}
			continue;
		}

		usedSourceFields.add(match.sourceField);
		matchedColumns.push(match);
		mappings.push(
			createTemplateFieldMapping({ match, templateColumn, formatProfile })
		);
	}

	appendInferredMappings({
		mappings,
		inferredMappings,
		usedSourceFields,
		formatProfile,
	});

	return {
		mappings,
		issues,
		matchedColumns,
		unmatchedTemplateColumns,
		unmatchedSourceColumns: args.batch.columns.filter(
			(column) => !usedSourceFields.has(column.key)
		),
		source: 'template',
	};
}

export const resolveImportTemplateMappings = resolveTemplateMappings;

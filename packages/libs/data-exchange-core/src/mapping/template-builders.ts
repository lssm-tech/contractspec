import type {
	FieldMapping,
	FormatProfile,
	ImportTemplateColumn,
	TemplateColumnMatch,
	ValidationIssue,
} from '../types';
import { resolveColumnFormat } from './template-format';

export function createRequiredMappingIssue(
	templateColumn: ImportTemplateColumn
): ValidationIssue {
	return {
		severity: 'error',
		code: 'mapping.required-unmatched',
		message: `Required import template column ${templateColumn.label} is not mapped.`,
		fieldPath: templateColumn.targetField,
	};
}

export function createSchemaMatch(
	templateColumn: ImportTemplateColumn,
	fallback?: FieldMapping
): TemplateColumnMatch | null {
	if (!fallback) return null;
	return {
		templateColumnKey: templateColumn.key,
		targetField: templateColumn.targetField,
		sourceField: fallback.sourceField,
		confidence: fallback.confidence ?? 0.75,
		strategy: 'schema',
	};
}

export function createTemplateFieldMapping(args: {
	match: TemplateColumnMatch;
	templateColumn: ImportTemplateColumn;
	formatProfile?: FormatProfile;
}): FieldMapping {
	return {
		sourceField: args.match.sourceField,
		targetField: args.templateColumn.targetField,
		required: args.templateColumn.required,
		confidence: args.match.confidence,
		sourceAliases: args.templateColumn.sourceAliases,
		format: resolveColumnFormat(args.templateColumn, args.formatProfile),
		templateColumnKey: args.templateColumn.key,
		status: args.match.strategy === 'schema' ? 'inferred' : 'matched',
		notes:
			args.match.strategy === 'exact'
				? undefined
				: [
						`Mapped by ${args.match.strategy} match from ${args.match.sourceField}.`,
					],
	};
}

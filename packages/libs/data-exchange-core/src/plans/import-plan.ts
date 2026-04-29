import type { AnySchemaModel } from '@contractspec/lib.schema';
import type {
	DataExchangeTemplate,
	FieldMapping,
	FormatProfile,
	ImportPlan,
	InterchangeSource,
	InterchangeTarget,
	ReconciliationPolicy,
	RecordBatch,
} from '../types';
import {
	createPlanIssues,
	defaultReconciliationPolicy,
	resolvePlanMappings,
} from './shared';

export function createImportPlan(args: {
	source: InterchangeSource;
	target: InterchangeTarget;
	schema: AnySchemaModel;
	sourceBatch: RecordBatch;
	mappings?: FieldMapping[];
	template?: DataExchangeTemplate;
	formatProfile?: FormatProfile;
	reconciliationPolicy?: ReconciliationPolicy;
	sampleSize?: number;
}): ImportPlan {
	const templateMapping = resolvePlanMappings(args);
	return {
		direction: 'import',
		source: args.source,
		target: args.target,
		schema: args.schema,
		sourceBatch: args.sourceBatch,
		mappings: templateMapping.mappings,
		mappingSource: templateMapping.source,
		template: args.template,
		formatProfile: args.formatProfile ?? args.template?.formatProfile,
		templateMapping,
		reconciliationPolicy:
			args.reconciliationPolicy ?? defaultReconciliationPolicy,
		issues: [
			...createPlanIssues(templateMapping.mappings),
			...templateMapping.issues,
		],
		sampleSize: args.sampleSize ?? 5,
	};
}

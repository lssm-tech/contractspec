import type { AnySchemaModel } from '@contractspec/lib.schema';
import type {
	ExportPlan,
	ExportTemplate,
	FieldMapping,
	FormatProfile,
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

export function createExportPlan(args: {
	source: InterchangeSource;
	target: InterchangeTarget;
	schema: AnySchemaModel;
	sourceBatch: RecordBatch;
	mappings?: FieldMapping[];
	template?: ExportTemplate;
	formatProfile?: FormatProfile;
	reconciliationPolicy?: ReconciliationPolicy;
	sampleSize?: number;
}): ExportPlan {
	const templateMapping = resolvePlanMappings(args);
	return {
		direction: 'export',
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

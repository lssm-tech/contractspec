import type { AnySchemaModel } from '@contractspec/lib.schema';
import { inferFieldMappings } from '../mapping';
import type {
	ExportPlan,
	FieldMapping,
	InterchangeSource,
	InterchangeTarget,
	ReconciliationPolicy,
	RecordBatch,
} from '../types';
import { createPlanIssues, defaultReconciliationPolicy } from './shared';

export function createExportPlan(args: {
	source: InterchangeSource;
	target: InterchangeTarget;
	schema: AnySchemaModel;
	sourceBatch: RecordBatch;
	mappings?: FieldMapping[];
	reconciliationPolicy?: ReconciliationPolicy;
	sampleSize?: number;
}): ExportPlan {
	const mappings =
		args.mappings ?? inferFieldMappings(args.sourceBatch, args.schema);
	return {
		direction: 'export',
		source: args.source,
		target: args.target,
		schema: args.schema,
		sourceBatch: args.sourceBatch,
		mappings,
		reconciliationPolicy:
			args.reconciliationPolicy ?? defaultReconciliationPolicy,
		issues: createPlanIssues(mappings),
		sampleSize: args.sampleSize ?? 5,
	};
}

import type { AnySchemaModel } from '@contractspec/lib.schema';
import { inferFieldMappings } from '../mapping';
import type {
	FieldMapping,
	ImportPlan,
	InterchangeSource,
	InterchangeTarget,
	ReconciliationPolicy,
	RecordBatch,
} from '../types';
import { createPlanIssues, defaultReconciliationPolicy } from './shared';

export function createImportPlan(args: {
	source: InterchangeSource;
	target: InterchangeTarget;
	schema: AnySchemaModel;
	sourceBatch: RecordBatch;
	mappings?: FieldMapping[];
	reconciliationPolicy?: ReconciliationPolicy;
	sampleSize?: number;
}): ImportPlan {
	const mappings =
		args.mappings ?? inferFieldMappings(args.sourceBatch, args.schema);
	return {
		direction: 'import',
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

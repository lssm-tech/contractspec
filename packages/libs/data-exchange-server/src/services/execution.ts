import {
	createExportPlan,
	createImportPlan,
	createRecordBatch,
	type ExecutionResult,
	type FieldMapping,
	type PreviewResult,
	previewExport,
	previewImport,
	type ReconciliationPolicy,
} from '@contractspec/lib.data-exchange-core';
import type { AnySchemaModel } from '@contractspec/lib.schema';
import type { AdapterRegistry, ExecuteRunArgs } from '../types';
import { readSourceBatch, writeTargetBatch } from './io';

function createAuditTrail(
	step: string,
	message: string,
	status: 'success' | 'warning' | 'error'
) {
	return { step, message, status } as const;
}

function previewIssues(preview: PreviewResult) {
	return preview.issues.filter((issue) => issue.severity === 'error');
}

export async function dryRunImport(
	args: ExecuteRunArgs & {
		schema: AnySchemaModel;
		mappings?: FieldMapping[];
		reconciliationPolicy?: ReconciliationPolicy;
		registry?: AdapterRegistry;
		sampleSize?: number;
	}
) {
	const sourceBatch = await readSourceBatch(args.source, args.registry);
	return previewImport(
		createImportPlan({
			source: args.source,
			target: args.target,
			schema: args.schema,
			sourceBatch,
			mappings: args.mappings,
			reconciliationPolicy: args.reconciliationPolicy,
			sampleSize: args.sampleSize,
		})
	);
}

export async function dryRunExport(
	args: ExecuteRunArgs & {
		schema: AnySchemaModel;
		mappings?: FieldMapping[];
		reconciliationPolicy?: ReconciliationPolicy;
		registry?: AdapterRegistry;
		sampleSize?: number;
	}
) {
	const sourceBatch = await readSourceBatch(args.source, args.registry);
	return previewExport(
		createExportPlan({
			source: args.source,
			target: args.target,
			schema: args.schema,
			sourceBatch,
			mappings: args.mappings,
			reconciliationPolicy: args.reconciliationPolicy,
			sampleSize: args.sampleSize,
		})
	);
}

async function executePreviewWrite(args: {
	preview: PreviewResult;
	target: ExecuteRunArgs['target'];
	registry?: AdapterRegistry;
	reconciliationPolicy: ReconciliationPolicy;
}): Promise<ExecutionResult> {
	const blockingIssues = previewIssues(args.preview);
	if (blockingIssues.length > 0) {
		return {
			success: false,
			processed: args.preview.sampleRecords.length,
			succeeded: 0,
			failed: blockingIssues.length,
			skipped: args.preview.sampleRecords.length,
			issues: args.preview.issues,
			auditTrail: [
				createAuditTrail(
					'validate',
					'Execution halted because preview produced blocking issues.',
					'error'
				),
			],
		};
	}

	const batch = createRecordBatch(args.preview.normalizedRecords, {
		name: args.preview.plan.sourceBatch.name,
		format:
			args.preview.plan.target.format ?? args.preview.plan.sourceBatch.format,
		metadata: args.preview.plan.sourceBatch.metadata,
	});
	const writeResult = await writeTargetBatch(
		args.target,
		batch,
		args.registry,
		args.reconciliationPolicy
	);

	return {
		success: writeResult.failed === 0,
		processed: batch.records.length,
		succeeded: writeResult.written,
		failed: writeResult.failed,
		skipped: 0,
		issues: args.preview.issues,
		auditTrail: [
			createAuditTrail('profile', 'Source batch profiled.', 'success'),
			createAuditTrail('preview', 'Preview executed successfully.', 'success'),
			createAuditTrail(
				'write',
				`Wrote ${writeResult.written} record(s) to ${args.target.kind}.`,
				writeResult.failed > 0 ? 'warning' : 'success'
			),
		],
		batch: writeResult.batch ?? batch,
	};
}

export async function executeImport(
	args: ExecuteRunArgs & {
		schema: AnySchemaModel;
		mappings?: FieldMapping[];
		reconciliationPolicy?: ReconciliationPolicy;
		registry?: AdapterRegistry;
		sampleSize?: number;
	}
): Promise<ExecutionResult> {
	const preview = await dryRunImport(args);
	return executePreviewWrite({
		preview,
		target: args.target,
		registry: args.registry,
		reconciliationPolicy: preview.plan.reconciliationPolicy,
	});
}

export async function executeExport(
	args: ExecuteRunArgs & {
		schema: AnySchemaModel;
		mappings?: FieldMapping[];
		reconciliationPolicy?: ReconciliationPolicy;
		registry?: AdapterRegistry;
		sampleSize?: number;
	}
): Promise<ExecutionResult> {
	const preview = await dryRunExport(args);
	return executePreviewWrite({
		preview,
		target: args.target,
		registry: args.registry,
		reconciliationPolicy: preview.plan.reconciliationPolicy,
	});
}

import { applyMappingToRecord } from '../mapping';
import { coerceRecordToSchema } from '../schema';
import type { ExportPlan, ImportPlan, PreviewResult } from '../types';
import { diffRecords } from './diff';

function executePreview(plan: ImportPlan | ExportPlan): PreviewResult {
	const sampleRecords = plan.sourceBatch.records.slice(0, plan.sampleSize);
	const normalizedRecords = sampleRecords.map((record) => {
		const mapped = applyMappingToRecord(record, plan.mappings);
		return coerceRecordToSchema(mapped, plan.schema).record;
	});
	const issues = normalizedRecords.flatMap((record, index) =>
		coerceRecordToSchema(record, plan.schema).issues.map((issue) => ({
			...issue,
			recordIndex: issue.recordIndex ?? index,
		}))
	);
	const changes = sampleRecords.flatMap((record, index) =>
		diffRecords(record, normalizedRecords[index] ?? {}, index)
	);

	return {
		plan,
		sampleRecords,
		normalizedRecords,
		issues: [...plan.issues, ...issues],
		changes,
	};
}

export function previewImport(plan: ImportPlan): PreviewResult {
	return executePreview(plan);
}

export function previewExport(plan: ExportPlan): PreviewResult {
	return executePreview(plan);
}

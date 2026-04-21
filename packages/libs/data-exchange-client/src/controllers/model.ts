import {
	describeSchemaFields,
	type ExecutionResult,
	type FieldMapping,
	flattenRecord,
	type PreviewResult,
} from '@contractspec/lib.data-exchange-core';
import type { DataExchangeViewModel } from '../types';

function countIssues(preview: PreviewResult) {
	return preview.issues.reduce(
		(summary: DataExchangeViewModel['validationSummary'], issue) => {
			summary[`${issue.severity}s` as keyof typeof summary] += 1;
			return summary;
		},
		{ errors: 0, warnings: 0, info: 0 }
	);
}

export function createDataExchangeViewModel(args: {
	preview: PreviewResult;
	mappings?: FieldMapping[];
	executionResult?: ExecutionResult;
}): DataExchangeViewModel {
	const mappings = args.mappings ?? args.preview.plan.mappings;
	const schemaFields = describeSchemaFields(args.preview.plan.schema);

	return {
		mappingRows: mappings.map((mapping: FieldMapping, index: number) => ({
			id: `${mapping.targetField}-${index}`,
			sourceField: mapping.sourceField,
			targetField: mapping.targetField,
			confidence: mapping.confidence,
			required: mapping.required,
		})),
		sourceRows: args.preview.sampleRecords.map((record, index: number) => ({
			id: `source-${index}`,
			...flattenRecord(record),
		})),
		previewRows: args.preview.normalizedRecords.map(
			(record, index: number) => ({
				id: `preview-${index}`,
				...flattenRecord(record),
			})
		),
		changeRows: args.preview.changes.map((change, index: number) => ({
			id: `change-${index}`,
			recordIndex: change.recordIndex,
			fieldPath: change.fieldPath,
			before: change.before ?? '',
			after: change.after ?? '',
			changeType: change.changeType,
		})),
		validationSummary: countIssues(args.preview),
		...(schemaFields.length > 0
			? {
					previewRows: args.preview.normalizedRecords.map(
						(record, index: number) => ({
							id: `preview-${index}`,
							...Object.fromEntries(
								schemaFields.map((field) => [
									field.key,
									flattenRecord(record)[field.key],
								])
							),
						})
					),
				}
			: {}),
	};
}

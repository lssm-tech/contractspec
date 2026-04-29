import {
	describeSchemaFields,
	type ExecutionResult,
	type FieldMapping,
	type FormatProfile,
	flattenRecord,
	type PreviewResult,
} from '@contractspec/lib.data-exchange-core';
import type {
	DataExchangeViewModel,
	ResolvedDataExchangeViewModel,
} from '../types';
import { createMappingRows, createTemplateRows } from './model-rows';

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
	formatProfile?: FormatProfile;
	executionResult?: ExecutionResult;
}): ResolvedDataExchangeViewModel {
	const mappings = args.mappings ?? args.preview.plan.mappings;
	const schemaFields = describeSchemaFields(args.preview.plan.schema);
	const mappingRows = createMappingRows(mappings);
	const mappedSourceFields = new Set(
		mappings.map((mapping) => mapping.sourceField).filter(Boolean)
	);
	const ignoredSourceColumns = args.preview.plan.sourceBatch.columns
		.filter((column) => !mappedSourceFields.has(column.key))
		.map((column) => column.key);
	const templateRows = createTemplateRows({
		preview: args.preview,
		mappings,
		mappingRows,
		formatProfile: args.formatProfile,
		ignoredSourceColumns,
	});

	return {
		mappingRows,
		templateRows,
		unmatchedRequiredRows: templateRows.filter(
			(row) => row.required && row.unmatched
		),
		ignoredSourceColumns,
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

import type {
	ExecutionResult,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';
import { Text, View } from 'react-native';
import type { DataExchangeViewModel } from '../types';

export function NativeTemplateMappingPanel({
	model,
}: {
	model: DataExchangeViewModel;
}) {
	const templateRows = model.templateRows ?? [];
	const ignoredSourceColumns = model.ignoredSourceColumns ?? [];
	if (templateRows.length === 0) {
		return null;
	}

	return (
		<View>
			<Text>Column Mapping</Text>
			{templateRows.map((row) => (
				<Text key={row.id}>
					{row.label}: {row.sourceField || 'Unmatched'} -&gt; {row.targetField}
					{row.formatLabel ? ` (${row.formatLabel})` : ''}
				</Text>
			))}
			{ignoredSourceColumns.length > 0 ? (
				<Text>Ignored source columns: {ignoredSourceColumns.join(', ')}</Text>
			) : null}
		</View>
	);
}

export function NativeValidationPanel({ preview }: { preview: PreviewResult }) {
	return (
		<View>
			<Text>Validation</Text>
			{preview.issues.map((issue, index: number) => (
				<Text key={`${issue.code}-${index}`}>
					{issue.severity}: {issue.message}
				</Text>
			))}
		</View>
	);
}

export function NativeRunAuditView({
	executionResult,
}: {
	executionResult?: ExecutionResult;
}) {
	if (!executionResult) {
		return (
			<View>
				<Text>No execution audit available.</Text>
			</View>
		);
	}

	return (
		<View>
			<Text>Run Audit</Text>
			{executionResult.auditTrail.map((entry, index: number) => (
				<Text key={`${entry.step}-${index}`}>
					{entry.status}: {entry.message}
				</Text>
			))}
		</View>
	);
}

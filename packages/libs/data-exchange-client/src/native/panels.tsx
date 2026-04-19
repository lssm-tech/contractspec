import type {
	ExecutionResult,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';
import { Text, View } from 'react-native';

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

import type {
	ExecutionResult,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';

export function WebValidationPanel({ preview }: { preview: PreviewResult }) {
	return (
		<div>
			<h3>Validation</h3>
			<ul>
				{preview.issues.map((issue, index: number) => (
					<li key={`${issue.code}-${index}`}>
						{issue.severity}: {issue.message}
					</li>
				))}
			</ul>
		</div>
	);
}

export function WebRunAuditView({
	executionResult,
}: {
	executionResult?: ExecutionResult;
}) {
	if (!executionResult) {
		return <div>No execution audit available.</div>;
	}

	return (
		<div>
			<h3>Run Audit</h3>
			<ul>
				{executionResult.auditTrail.map((entry, index: number) => (
					<li key={`${entry.step}-${index}`}>
						{entry.status}: {entry.message}
					</li>
				))}
			</ul>
		</div>
	);
}

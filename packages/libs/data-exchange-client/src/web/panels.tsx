import type {
	ExecutionResult,
	PreviewResult,
} from '@contractspec/lib.data-exchange-core';
import type { DataExchangeViewModel } from '../types';

export function WebTemplateMappingPanel({
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
		<div>
			<h3>Column Mapping</h3>
			<ul>
				{templateRows.map((row) => (
					<li key={row.id}>
						{row.label}: {row.sourceField || 'Unmatched'} -&gt;{' '}
						{row.targetField}
						{row.formatLabel ? ` (${row.formatLabel})` : ''}
						{row.confidence !== undefined
							? ` confidence ${row.confidence}`
							: ''}
					</li>
				))}
			</ul>
			{ignoredSourceColumns.length > 0 ? (
				<p>Ignored source columns: {ignoredSourceColumns.join(', ')}</p>
			) : null}
		</div>
	);
}

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

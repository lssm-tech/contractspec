'use client';

import { DetailField, DetailPanel } from './FinanceOpsDetailPanel';
import {
	SelectableRow,
	WorkflowWorkspace,
} from './FinanceOpsCockpitWorkspace';
import { formatDraftStatus } from './FinanceOpsDemoChrome';
import type {
	FinanceOpsDemoSession,
	FinanceOpsDraftStatus,
	FinanceOpsWorkflowScreenId,
} from './finance-ops-ai-workflows-demo-session';
import type {
	AdoptionUsageView,
	FinanceOpsPreviewModel,
} from './finance-ops-ai-workflows-preview.model';

export function AdoptionRoiScreen({
	draftStatuses,
	model,
	onMarkReady,
	onRequestChanges,
	onSelectUsage,
	selectedUsageLogId,
	status,
}: {
	draftStatuses: FinanceOpsDemoSession['draftStatuses'];
	model: FinanceOpsPreviewModel;
	onMarkReady: () => void;
	onRequestChanges: () => void;
	onSelectUsage: (usageLogId: string) => void;
	selectedUsageLogId: string;
	status: FinanceOpsDraftStatus;
}) {
	const selected =
		model.adoption.usages.find(
			(usage) => usage.result.usageLogId === selectedUsageLogId
		) ?? model.adoption.usages[0];

	return (
		<WorkflowWorkspace
			detail={
				<DetailPanel
					eyebrow="Selected detail"
					onMarkReady={onMarkReady}
					onRequestChanges={onRequestChanges}
					status={status}
					title={selected?.useCase ?? 'Adoption log'}
				>
					<DetailField label="Team" value={selected?.team ?? ''} />
					<DetailField
						label="Minutes saved"
						value={String(selected?.result.estimatedMinutesSaved ?? 0)}
					/>
					<DetailField
						label="Risk"
						value={`${selected?.dataRisk ?? 'low'} data risk · quality ${selected?.quality ?? 'medium'}`}
					/>
					<DetailField
						label="Recommendation"
						value={selected?.result.recommendedNextStep ?? 'monitor'}
					/>
					<DetailField
						label="Review"
						value={
							selected?.humanValidated
								? 'Human validation recorded; standardize only after owner sign-off.'
								: 'Do not standardize; review training support and validation gap first.'
						}
					/>
				</DetailPanel>
			}
			list={model.adoption.usages.map((usage) => (
				<SelectableRow
					badge={formatDraftStatus(getWorkflowStatus(usage, draftStatuses))}
					key={usage.result.usageLogId}
					label={usage.useCase}
					meta={`${usage.team} · ${usage.workflowKey}`}
					onSelect={() => onSelectUsage(usage.result.usageLogId)}
					selected={usage.result.usageLogId === selected?.result.usageLogId}
					value={`${usage.result.estimatedMinutesSaved} min`}
				/>
			))}
			listTitle="Usage log"
			metrics={[
				{
					label: 'Minutes saved',
					value: String(model.adoption.totalMinutesSaved),
				},
				{ label: 'Hours saved', value: String(model.adoption.totalHoursSaved) },
				{
					label: 'Recommendations',
					value: String(model.adoption.recommendations.length),
				},
				{ label: 'Entries', value: String(model.adoption.usages.length) },
			]}
			status={status}
			summary="Workflow-level adoption log for time saved, quality, data risk and governance next steps."
			title="Adoption ROI"
		/>
	);
}

function getWorkflowStatus(
	usage: AdoptionUsageView,
	statuses: FinanceOpsDemoSession['draftStatuses']
): FinanceOpsDraftStatus {
	const workflow = workflowByKey[usage.workflowKey];
	return workflow ? statuses[workflow] : 'not_started';
}

const workflowByKey: Record<string, FinanceOpsWorkflowScreenId> = {
	'financeOps.aiAdoption.logUsage': 'adoption',
	'financeOps.cashAging.prioritize': 'cash',
	'financeOps.missionIntake.triage': 'mission',
	'financeOps.procedureDraft.create': 'procedure',
	'financeOps.reportingNarrative.compose': 'reporting',
};

'use client';

import { DetailField, DetailPanel } from './FinanceOpsDetailPanel';
import {
	SelectableRow,
	WorkflowWorkspace,
} from './FinanceOpsCockpitWorkspace';
import type { FinanceOpsDraftStatus } from './finance-ops-ai-workflows-demo-session';
import { readString } from './finance-ops-ai-workflows-preview.helpers';
import type { FinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

export function ProcedureDraftScreen({
	model,
	onMarkReady,
	onRequestChanges,
	onSelectProcedureItem,
	selectedProcedureItemId,
	status,
}: {
	model: FinanceOpsPreviewModel;
	onMarkReady: () => void;
	onRequestChanges: () => void;
	onSelectProcedureItem: (itemId: string) => void;
	selectedProcedureItemId: string;
	status: FinanceOpsDraftStatus;
}) {
	const selectedIndex = Math.max(
		0,
		model.procedure.steps.findIndex((step) => step === selectedProcedureItemId)
	);
	const selectedStep = model.procedure.steps[selectedIndex] ?? '';
	const role = model.procedure.roles[selectedIndex % model.procedure.roles.length];

	return (
		<WorkflowWorkspace
			detail={
				<DetailPanel
					eyebrow="Selected detail"
					onMarkReady={onMarkReady}
					onRequestChanges={onRequestChanges}
					status={status}
					title={`Step ${selectedIndex + 1}`}
				>
					<DetailField label="Procedure step" value={selectedStep} />
					<DetailField
						label="Responsible"
						value={`${readString(role ?? {}, 'role', 'Process owner')} · ${readString(role ?? {}, 'responsibility', 'Validate execution and evidence.')}`}
					/>
					<DetailField
						label="Control"
						value={
							model.procedure.controls[selectedIndex] ??
							model.procedure.controls[0] ??
							'Named validation owner'
						}
					/>
					<DetailField
						label="KPI"
						value={
							model.procedure.kpis[selectedIndex] ??
							model.procedure.kpis[0] ??
							'Review completion rate'
						}
					/>
					<DetailField
						label="Open question"
						value={
							model.procedure.openQuestions[selectedIndex] ??
							model.procedure.openQuestions[0] ??
							'Who owns final sign-off?'
						}
					/>
				</DetailPanel>
			}
			list={model.procedure.steps.map((step, index) => (
				<SelectableRow
					badge={`step ${index + 1}`}
					key={`${index}-${step}`}
					label={step}
					meta={
						readString(
							model.procedure.roles[index % model.procedure.roles.length] ??
								{},
							'role',
							'Process owner'
						)
					}
					onSelect={() => onSelectProcedureItem(step)}
					selected={step === selectedStep}
				/>
			))}
			listTitle="Procedure steps"
			metrics={[
				{
					label: 'Procedure',
					value: model.procedure.result.procedureTitle,
				},
				{ label: 'Controls', value: String(model.procedure.controls.length) },
				{ label: 'KPIs', value: String(model.procedure.kpis.length) },
				{
					label: 'Questions',
					value: String(model.procedure.openQuestions.length),
				},
			]}
			status={status}
			summary={model.procedure.result.scope}
			title="Procedure draft"
		/>
	);
}

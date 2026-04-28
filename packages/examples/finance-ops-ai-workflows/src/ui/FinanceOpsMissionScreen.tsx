'use client';

import { DetailField, DetailPanel } from './FinanceOpsDetailPanel';
import {
	SelectableRow,
	WorkflowWorkspace,
} from './FinanceOpsCockpitWorkspace';
import type { FinanceOpsDraftStatus } from './finance-ops-ai-workflows-demo-session';
import type { FinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

interface MissionItem {
	detail: string;
	id: string;
	label: string;
	meta: string;
	review: string;
	type: string;
}

export function MissionIntakeScreen({
	model,
	onMarkReady,
	onRequestChanges,
	onSelectMissionItem,
	selectedMissionItemId,
	status,
}: {
	model: FinanceOpsPreviewModel;
	onMarkReady: () => void;
	onRequestChanges: () => void;
	onSelectMissionItem: (itemId: string) => void;
	selectedMissionItemId: string;
	status: FinanceOpsDraftStatus;
}) {
	const items = buildMissionItems(model);
	const selected = items.find((item) => item.id === selectedMissionItemId) ?? items[0];

	return (
		<WorkflowWorkspace
			detail={
				<DetailPanel
					eyebrow="Selected detail"
					onMarkReady={onMarkReady}
					onRequestChanges={onRequestChanges}
					status={status}
					title={selected?.label ?? 'Mission intake'}
				>
					<DetailField label="Type" value={selected?.type ?? 'Mission'} />
					<DetailField
						label="Priority"
						value={model.mission.result.priority}
					/>
					<DetailField
						label="Business content"
						value={selected?.detail ?? model.mission.result.riskSummary}
					/>
					<DetailField
						label="Review question"
						value={selected?.review ?? 'Who validates the mission scope?'}
					/>
					<DetailField
						label="Next workflow"
						value={model.mission.result.suggestedNextWorkflow}
					/>
				</DetailPanel>
			}
			list={items.map((item) => (
				<SelectableRow
					badge={item.type}
					key={item.id}
					label={item.label}
					meta={item.meta}
					onSelect={() => onSelectMissionItem(item.id)}
					selected={item.id === selected?.id}
				/>
			))}
			listTitle="Intake queue"
			metrics={[
				{ label: 'Mission type', value: model.mission.result.missionType },
				{ label: 'Priority', value: model.mission.result.priority },
				{ label: 'Risks', value: String(model.mission.risks.length) },
				{ label: 'Documents', value: String(model.mission.documents.length) },
			]}
			status={status}
			summary={model.mission.result.riskSummary}
			title="Mission intake"
		/>
	);
}

function buildMissionItems(model: FinanceOpsPreviewModel): readonly MissionItem[] {
	return [
		...model.mission.risks.slice(0, 5).map((risk, index) => ({
			detail: `${risk} flagged in the intake brief.`,
			id: `risk:${index}`,
			label: risk,
			meta: 'Needs executive validation',
			review: 'Is this risk urgent this week or this quarter?',
			type: 'Risk',
		})),
		...model.mission.documents.slice(0, 5).map((document, index) => ({
			detail: document,
			id: `document:${index}`,
			label: document,
			meta: 'Evidence to request before drafting',
			review: 'Who can provide this document and by when?',
			type: 'Evidence',
		})),
		...model.mission.questions.slice(0, 5).map((question, index) => ({
			detail: question,
			id: `question:${index}`,
			label: question,
			meta: 'Executive clarification',
			review: 'Capture the answer before handoff.',
			type: 'Question',
		})),
	];
}

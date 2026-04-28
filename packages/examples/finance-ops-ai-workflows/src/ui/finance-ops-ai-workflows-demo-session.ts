import type { FinanceOpsDemoScenario } from '../fixtures';
import type {
	FinanceOpsPreviewModel,
	FinanceOpsPreviewScreenId,
} from './finance-ops-ai-workflows-preview.model';

export type FinanceOpsWorkflowScreenId = Exclude<
	FinanceOpsPreviewScreenId,
	'home'
>;

export type FinanceOpsDraftStatus =
	| 'not_started'
	| 'draft_ready'
	| 'changes_requested'
	| 'marked_ready';

export interface FinanceOpsDemoSession {
	activeScreen: FinanceOpsPreviewScreenId;
	completedWorkflowIds: readonly FinanceOpsWorkflowScreenId[];
	draftStatuses: Record<FinanceOpsWorkflowScreenId, FinanceOpsDraftStatus>;
	scenarioId: FinanceOpsDemoScenario['id'];
	selectedAdoptionUsageId: string;
	selectedCashInvoiceId: string;
	selectedMissionItemId: string;
	selectedProcedureItemId: string;
	selectedReportingMetric: string;
	statusStep: number;
}

export type FinanceOpsDemoSessionAction =
	| {
			type: 'select_scenario';
			scenarioId: FinanceOpsDemoScenario['id'];
	  }
	| { type: 'reset_replay' }
	| { type: 'select_screen'; screen: FinanceOpsPreviewScreenId }
	| { type: 'run_workflow'; workflow: FinanceOpsWorkflowScreenId }
	| {
			type: 'select_mission_item';
			itemId: string;
	  }
	| {
			type: 'select_cash_invoice';
			invoiceId: string;
	  }
	| {
			type: 'select_procedure_item';
			itemId: string;
	  }
	| {
			type: 'select_reporting_metric';
			metric: string;
	  }
	| {
			type: 'select_adoption_usage';
			usageLogId: string;
	  }
	| {
			type: 'request_changes';
			workflow: FinanceOpsWorkflowScreenId;
	  }
	| {
			type: 'mark_ready';
			workflow: FinanceOpsWorkflowScreenId;
	  };

export function createFinanceOpsDemoSession(
	scenarioId: FinanceOpsDemoScenario['id']
): FinanceOpsDemoSession {
	return {
		activeScreen: 'mission',
		completedWorkflowIds: [],
		draftStatuses: createInitialDraftStatuses(),
		scenarioId,
		selectedAdoptionUsageId: '',
		selectedCashInvoiceId: '',
		selectedMissionItemId: '',
		selectedProcedureItemId: '',
		selectedReportingMetric: '',
		statusStep: 0,
	};
}

export function financeOpsDemoSessionReducer(
	state: FinanceOpsDemoSession,
	action: FinanceOpsDemoSessionAction
): FinanceOpsDemoSession {
	switch (action.type) {
		case 'select_scenario':
			return createFinanceOpsDemoSession(action.scenarioId);
		case 'reset_replay':
			return {
				...createFinanceOpsDemoSession(state.scenarioId),
				activeScreen: state.activeScreen,
			};
		case 'select_screen':
			return { ...state, activeScreen: action.screen };
		case 'run_workflow':
			return {
				...state,
				activeScreen: action.workflow,
				draftStatuses: {
					...state.draftStatuses,
					[action.workflow]: 'draft_ready',
				},
				statusStep: 3,
			};
		case 'request_changes':
			return {
				...state,
				draftStatuses: {
					...state.draftStatuses,
					[action.workflow]: 'changes_requested',
				},
				statusStep: 2,
			};
		case 'mark_ready':
			return {
				...state,
				completedWorkflowIds: addUniqueWorkflow(
					state.completedWorkflowIds,
					action.workflow
				),
				draftStatuses: {
					...state.draftStatuses,
					[action.workflow]: 'marked_ready',
				},
				statusStep: 4,
			};
		case 'select_mission_item':
			return { ...state, selectedMissionItemId: action.itemId };
		case 'select_cash_invoice':
			return { ...state, selectedCashInvoiceId: action.invoiceId };
		case 'select_procedure_item':
			return { ...state, selectedProcedureItemId: action.itemId };
		case 'select_reporting_metric':
			return { ...state, selectedReportingMetric: action.metric };
		case 'select_adoption_usage':
			return { ...state, selectedAdoptionUsageId: action.usageLogId };
		default:
			return state;
	}
}

export function getActiveWorkflowId(
	screen: FinanceOpsPreviewScreenId
): FinanceOpsWorkflowScreenId {
	return screen === 'home' ? 'mission' : screen;
}

export function getSelectedCashInvoiceId(
	model: FinanceOpsPreviewModel,
	state: FinanceOpsDemoSession
): string {
	return state.selectedCashInvoiceId || model.cash.priorities[0]?.invoiceId || '';
}

export function getSelectedMissionItemId(
	model: FinanceOpsPreviewModel,
	state: FinanceOpsDemoSession
): string {
	return state.selectedMissionItemId || getDefaultMissionItemId(model);
}

export function getSelectedProcedureItemId(
	model: FinanceOpsPreviewModel,
	state: FinanceOpsDemoSession
): string {
	return state.selectedProcedureItemId || model.procedure.steps[0] || '';
}

export function getSelectedReportingMetric(
	model: FinanceOpsPreviewModel,
	state: FinanceOpsDemoSession
): string {
	return (
		state.selectedReportingMetric ||
		readRecordString(model.reporting.highlights[0], 'metric')
	);
}

export function getSelectedAdoptionUsageId(
	model: FinanceOpsPreviewModel,
	state: FinanceOpsDemoSession
): string {
	return (
		state.selectedAdoptionUsageId ||
		model.adoption.usages[0]?.result.usageLogId ||
		''
	);
}

function createInitialDraftStatuses(): Record<
	FinanceOpsWorkflowScreenId,
	FinanceOpsDraftStatus
> {
	return {
		adoption: 'not_started',
		cash: 'not_started',
		mission: 'not_started',
		procedure: 'not_started',
		reporting: 'not_started',
	};
}

function addUniqueWorkflow(
	current: readonly FinanceOpsWorkflowScreenId[],
	workflow: FinanceOpsWorkflowScreenId
): readonly FinanceOpsWorkflowScreenId[] {
	return current.includes(workflow) ? current : [...current, workflow];
}

function getDefaultMissionItemId(model: FinanceOpsPreviewModel): string {
	if (model.mission.risks[0]) return 'risk:0';
	if (model.mission.documents[0]) return 'document:0';
	if (model.mission.questions[0]) return 'question:0';
	return '';
}

function readRecordString(
	record: Record<string, unknown> | undefined,
	key: string
): string {
	if (!record) return '';
	const value = record[key];
	return typeof value === 'string' ? value : '';
}

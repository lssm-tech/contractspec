import { describe, expect, test } from 'bun:test';
import {
	createFinanceOpsDemoSession,
	financeOpsDemoSessionReducer,
	getSelectedAdoptionUsageId,
	getSelectedCashInvoiceId,
	getSelectedMissionItemId,
	getSelectedProcedureItemId,
	getSelectedReportingMetric,
} from './finance-ops-ai-workflows-demo-session';
import { buildFinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

describe('finance ops demo session', () => {
	test('initializes a deterministic replay session', () => {
		const session = createFinanceOpsDemoSession('pme-recovery');

		expect(session).toMatchObject({
			activeScreen: 'mission',
			completedWorkflowIds: [],
			scenarioId: 'pme-recovery',
			statusStep: 0,
		});
		expect(session.draftStatuses.cash).toBe('not_started');
	});

	test('scenario selection resets replay state and selections', () => {
		const started = financeOpsDemoSessionReducer(
			createFinanceOpsDemoSession('pme-recovery'),
			{ type: 'select_cash_invoice', invoiceId: 'INV-1002' }
		);
		const completed = financeOpsDemoSessionReducer(started, {
			type: 'mark_ready',
			workflow: 'cash',
		});

		const reset = financeOpsDemoSessionReducer(completed, {
			type: 'select_scenario',
			scenarioId: 'reporting-reset',
		});

		expect(reset.scenarioId).toBe('reporting-reset');
		expect(reset.selectedCashInvoiceId).toBe('');
		expect(reset.completedWorkflowIds).toEqual([]);
		expect(reset.draftStatuses.cash).toBe('not_started');
	});

	test('run and review transitions are deterministic', () => {
		const session = createFinanceOpsDemoSession('pme-recovery');
		const draft = financeOpsDemoSessionReducer(session, {
			type: 'run_workflow',
			workflow: 'cash',
		});
		const changes = financeOpsDemoSessionReducer(draft, {
			type: 'request_changes',
			workflow: 'cash',
		});
		const ready = financeOpsDemoSessionReducer(changes, {
			type: 'mark_ready',
			workflow: 'cash',
		});

		expect(draft.draftStatuses.cash).toBe('draft_ready');
		expect(changes.draftStatuses.cash).toBe('changes_requested');
		expect(ready.draftStatuses.cash).toBe('marked_ready');
		expect(ready.completedWorkflowIds).toEqual(['cash']);
	});

	test('selected ids use explicit session value or handler-backed defaults', () => {
		const model = buildFinanceOpsPreviewModel('pme-recovery');
		const session = createFinanceOpsDemoSession('pme-recovery');
		const selectedCash = financeOpsDemoSessionReducer(session, {
			type: 'select_cash_invoice',
			invoiceId: 'INV-1003',
		});
		const selectedMission = financeOpsDemoSessionReducer(session, {
			type: 'select_mission_item',
			itemId: 'document:2',
		});
		const selectedProcedure = financeOpsDemoSessionReducer(session, {
			type: 'select_procedure_item',
			itemId: model.procedure.steps[1] ?? '',
		});
		const selectedReporting = financeOpsDemoSessionReducer(session, {
			type: 'select_reporting_metric',
			metric: 'Gross margin',
		});
		const selectedAdoption = financeOpsDemoSessionReducer(session, {
			type: 'select_adoption_usage',
			usageLogId: model.adoption.usages[1]?.result.usageLogId ?? '',
		});

		expect(getSelectedMissionItemId(model, session)).toBe('risk:0');
		expect(getSelectedMissionItemId(model, selectedMission)).toBe('document:2');
		expect(getSelectedCashInvoiceId(model, session)).toBe('INV-1002');
		expect(getSelectedCashInvoiceId(model, selectedCash)).toBe('INV-1003');
		expect(getSelectedProcedureItemId(model, session)).toBe(
			model.procedure.steps[0] ?? ''
		);
		expect(getSelectedProcedureItemId(model, selectedProcedure)).toBe(
			model.procedure.steps[1] ?? ''
		);
		expect(getSelectedReportingMetric(model, session)).toBe('Revenue');
		expect(getSelectedReportingMetric(model, selectedReporting)).toBe(
			'Gross margin'
		);
		expect(getSelectedAdoptionUsageId(model, session)).toBe(
			model.adoption.usages[0]?.result.usageLogId ?? ''
		);
		expect(getSelectedAdoptionUsageId(model, selectedAdoption)).toBe(
			model.adoption.usages[1]?.result.usageLogId ?? ''
		);
	});

	test('replay reset clears local selections and draft review state', () => {
		const model = buildFinanceOpsPreviewModel('pme-recovery');
		const dirty = [
			{ type: 'select_screen' as const, screen: 'adoption' as const },
			{ type: 'select_mission_item' as const, itemId: 'document:2' },
			{ type: 'select_cash_invoice' as const, invoiceId: 'INV-1003' },
			{
				type: 'select_procedure_item' as const,
				itemId: model.procedure.steps[1] ?? '',
			},
			{ type: 'select_reporting_metric' as const, metric: 'Gross margin' },
			{
				type: 'select_adoption_usage' as const,
				usageLogId: model.adoption.usages[1]?.result.usageLogId ?? '',
			},
			{ type: 'mark_ready' as const, workflow: 'cash' as const },
		].reduce(financeOpsDemoSessionReducer, createFinanceOpsDemoSession('pme-recovery'));

		const reset = financeOpsDemoSessionReducer(dirty, {
			type: 'reset_replay',
		});

		expect(reset.activeScreen).toBe('adoption');
		expect(reset.completedWorkflowIds).toEqual([]);
		expect(reset.draftStatuses.cash).toBe('not_started');
		expect(reset.selectedMissionItemId).toBe('');
		expect(reset.selectedCashInvoiceId).toBe('');
		expect(reset.selectedProcedureItemId).toBe('');
		expect(reset.selectedReportingMetric).toBe('');
		expect(reset.selectedAdoptionUsageId).toBe('');
		expect(getSelectedCashInvoiceId(model, reset)).toBe('INV-1002');
	});

	test('adoption events keep ROI minutes derived from handler-backed model', () => {
		const model = buildFinanceOpsPreviewModel('pme-recovery');

		const usageMinutes = model.adoption.usages.reduce(
			(total, usage) => total + usage.result.estimatedMinutesSaved,
			0
		);

		expect(usageMinutes).toBe(model.adoption.totalMinutesSaved);
		expect(model.adoption.usages[0]?.result.roiSummary).toContain(
			'measure workflow ROI'
		);
	});
});

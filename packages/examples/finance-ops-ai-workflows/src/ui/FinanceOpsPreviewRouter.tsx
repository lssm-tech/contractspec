'use client';

import type { Dispatch } from 'react';
import {
	CashAgingScreen,
	MissionIntakeScreen,
} from './FinanceOpsMissionCashScreens';
import {
	AdoptionRoiScreen,
	ProcedureDraftScreen,
	ReportingNarrativeScreen,
} from './FinanceOpsProcedureReportingAdoptionScreens';
import {
	getSelectedAdoptionUsageId,
	getSelectedCashInvoiceId,
	getSelectedMissionItemId,
	getSelectedProcedureItemId,
	getSelectedReportingMetric,
	type FinanceOpsDemoSession,
	type FinanceOpsDemoSessionAction,
} from './finance-ops-ai-workflows-demo-session';
import type {
	FinanceOpsPreviewModel,
	FinanceOpsPreviewScreenId,
} from './finance-ops-ai-workflows-preview.model';

export function FinanceOpsPreviewRouter({
	activeScreen,
	dispatch,
	model,
	session,
}: {
	activeScreen: FinanceOpsPreviewScreenId;
	dispatch: Dispatch<FinanceOpsDemoSessionAction>;
	model: FinanceOpsPreviewModel;
	session: FinanceOpsDemoSession;
}) {
	switch (activeScreen) {
		case 'mission':
			return (
				<MissionIntakeScreen
					model={model}
					onMarkReady={() =>
						dispatch({ type: 'mark_ready', workflow: 'mission' })
					}
					onRequestChanges={() =>
						dispatch({ type: 'request_changes', workflow: 'mission' })
					}
					onSelectMissionItem={(itemId) =>
						dispatch({ type: 'select_mission_item', itemId })
					}
					selectedMissionItemId={getSelectedMissionItemId(model, session)}
					status={session.draftStatuses.mission}
				/>
			);
		case 'cash':
			return (
				<CashAgingScreen
					model={model}
					onRequestChanges={() =>
						dispatch({ type: 'request_changes', workflow: 'cash' })
					}
					onMarkReady={() =>
						dispatch({ type: 'mark_ready', workflow: 'cash' })
					}
					onSelectInvoice={(invoiceId) =>
						dispatch({ type: 'select_cash_invoice', invoiceId })
					}
					selectedInvoiceId={getSelectedCashInvoiceId(model, session)}
					status={session.draftStatuses.cash}
				/>
			);
		case 'procedure':
			return (
				<ProcedureDraftScreen
					model={model}
					onMarkReady={() =>
						dispatch({ type: 'mark_ready', workflow: 'procedure' })
					}
					onRequestChanges={() =>
						dispatch({ type: 'request_changes', workflow: 'procedure' })
					}
					onSelectProcedureItem={(itemId) =>
						dispatch({ type: 'select_procedure_item', itemId })
					}
					selectedProcedureItemId={getSelectedProcedureItemId(model, session)}
					status={session.draftStatuses.procedure}
				/>
			);
		case 'reporting':
			return (
				<ReportingNarrativeScreen
					model={model}
					onMarkReady={() =>
						dispatch({ type: 'mark_ready', workflow: 'reporting' })
					}
					onRequestChanges={() =>
						dispatch({ type: 'request_changes', workflow: 'reporting' })
					}
					onSelectMetric={(metric) =>
						dispatch({ type: 'select_reporting_metric', metric })
					}
					selectedMetric={getSelectedReportingMetric(model, session)}
					status={session.draftStatuses.reporting}
				/>
			);
		case 'adoption':
			return (
				<AdoptionRoiScreen
					draftStatuses={session.draftStatuses}
					model={model}
					onMarkReady={() =>
						dispatch({ type: 'mark_ready', workflow: 'adoption' })
					}
					onRequestChanges={() =>
						dispatch({ type: 'request_changes', workflow: 'adoption' })
					}
					onSelectUsage={(usageLogId) =>
						dispatch({ type: 'select_adoption_usage', usageLogId })
					}
					selectedUsageLogId={getSelectedAdoptionUsageId(model, session)}
					status={session.draftStatuses.adoption}
				/>
			);
		default:
			return null;
	}
}

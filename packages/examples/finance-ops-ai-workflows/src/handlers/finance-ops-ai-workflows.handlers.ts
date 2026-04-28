import type { HandlerForOperationSpec } from '@contractspec/lib.contracts-spec';
import {
	ComposeReportingNarrative,
	CreateFinanceProcedureDraft,
	LogAiAdoptionRoi,
	PrioritizeCashAgingSnapshot,
	TriageFinanceMissionIntake,
} from '../contracts';
import {
	composeReportingNarrative,
	createProcedureDraft,
	logAiAdoptionUsage,
	prioritizeCashAging,
	triageMissionIntake,
} from './finance-ops-ai-workflows.workflows';

export * from './finance-ops-ai-workflows.adoption-rules';
export * from './finance-ops-ai-workflows.cash-aging-rules';
export * from './finance-ops-ai-workflows.guards';
export * from './finance-ops-ai-workflows.mission-rules';
export * from './finance-ops-ai-workflows.procedure-reporting-rules';
export * from './finance-ops-ai-workflows.types';
export * from './finance-ops-ai-workflows.utils';
export * from './finance-ops-ai-workflows.workflows';

export interface FinanceOpsAiWorkflowsHandlers {
	triageMissionIntake: HandlerForOperationSpec<
		typeof TriageFinanceMissionIntake
	>;
	prioritizeCashAging: HandlerForOperationSpec<
		typeof PrioritizeCashAgingSnapshot
	>;
	createProcedureDraft: HandlerForOperationSpec<
		typeof CreateFinanceProcedureDraft
	>;
	composeReportingNarrative: HandlerForOperationSpec<
		typeof ComposeReportingNarrative
	>;
	logAiAdoptionUsage: HandlerForOperationSpec<typeof LogAiAdoptionRoi>;
}

export function createFinanceOpsAiWorkflowsHandlers(): FinanceOpsAiWorkflowsHandlers {
	return {
		triageMissionIntake: async (input) => triageMissionIntake(input),
		prioritizeCashAging: async (input) => prioritizeCashAging(input),
		createProcedureDraft: async (input) => createProcedureDraft(input),
		composeReportingNarrative: async (input) =>
			composeReportingNarrative(input),
		logAiAdoptionUsage: async (input) => logAiAdoptionUsage(input),
	};
}

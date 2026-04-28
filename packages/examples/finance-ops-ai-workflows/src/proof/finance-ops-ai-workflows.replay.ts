import {
	adoptionUsageFixtures,
	cashAgingFixture,
	missionIntakeFixture,
	procedureDraftFixture,
	reportingNarrativeFixture,
} from '../fixtures';
import {
	createFinanceOpsAiWorkflowsHandlers,
	isRecord,
	normalizeBooleanLike,
	parseJsonArraySafely,
	parseNumberSafely,
} from '../handlers';

export interface FinanceOpsAiWorkflowsReplay {
	key: 'finance-ops-ai-workflows.replay';
	fixtures: {
		adoptionLogs: number;
		cashRows: number;
		kpis: number;
	};
	outputs: {
		adoptionRecommendations: readonly string[];
		cashDecision: string;
		missionPriority: string;
		procedureTitle: string;
		reportingPeriod: string;
	};
	safety: {
		deterministic: true;
		externalCalls: false;
		humanReviewRequired: true;
	};
}

export async function runFinanceOpsAiWorkflowsReplay(): Promise<FinanceOpsAiWorkflowsReplay> {
	const handlers = createFinanceOpsAiWorkflowsHandlers();
	const mission = await handlers.triageMissionIntake(
		missionIntakeFixture,
		{} as never
	);
	const cash = await handlers.prioritizeCashAging(
		cashAgingFixture,
		{} as never
	);
	const procedure = await handlers.createProcedureDraft(
		procedureDraftFixture,
		{} as never
	);
	const reporting = await handlers.composeReportingNarrative(
		reportingNarrativeFixture,
		{} as never
	);
	const adoption = await Promise.all(
		adoptionUsageFixtures.map((fixture) =>
			handlers.logAiAdoptionUsage(
				{
					...fixture,
					humanValidated: normalizeBooleanLike(fixture.humanValidated),
					timeAfterMinutes: parseNumberSafely(fixture.timeAfterMinutes),
					timeBeforeMinutes: parseNumberSafely(fixture.timeBeforeMinutes),
				},
				{} as never
			)
		)
	);
	const cashRows = parseJsonArraySafely(cashAgingFixture.rowsJson, isRecord);
	const kpis = parseJsonArraySafely(
		reportingNarrativeFixture.kpiSnapshotJson,
		isRecord
	);

	return {
		key: 'finance-ops-ai-workflows.replay',
		fixtures: {
			adoptionLogs: adoptionUsageFixtures.length,
			cashRows: cashRows.rows.length,
			kpis: kpis.rows.length,
		},
		outputs: {
			adoptionRecommendations: adoption.map((item) => item.recommendedNextStep),
			cashDecision: cash.workflowDecision,
			missionPriority: mission.priority,
			procedureTitle: procedure.procedureTitle,
			reportingPeriod: reporting.period,
		},
		safety: {
			deterministic: true,
			externalCalls: false,
			humanReviewRequired: true,
		},
	};
}

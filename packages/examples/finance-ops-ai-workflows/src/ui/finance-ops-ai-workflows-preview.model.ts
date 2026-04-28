import {
	defaultFinanceOpsDemoScenario,
	type FinanceOpsDemoScenario,
	financeOpsDemoScenarios,
} from '../fixtures';
import {
	type AdoptionNextStep,
	type AiAdoptionUsageResult,
	type CashAgingResult,
	composeReportingNarrative,
	createProcedureDraft,
	logAiAdoptionUsage,
	type MissionIntakeResult,
	parseNumberSafely,
	type ProcedureDraftResult,
	prioritizeCashAging,
	type ReportingNarrativeResult,
	triageMissionIntake,
} from '../handlers';
import { formatMoney, round2 } from './finance-ops-ai-workflows-preview.format';
import {
	type CashPriorityView,
	parseRecordList,
	parseStringList,
	stageDetail,
	toCashPriorityView,
	uniqueNextSteps,
} from './finance-ops-ai-workflows-preview.helpers';

export { formatMoney } from './finance-ops-ai-workflows-preview.format';
export type { CashPriorityView } from './finance-ops-ai-workflows-preview.helpers';

export type FinanceOpsPreviewScreenId =
	| 'home'
	| 'mission'
	| 'cash'
	| 'procedure'
	| 'reporting'
	| 'adoption';

export interface FinanceOpsPreviewScreen {
	id: FinanceOpsPreviewScreenId;
	label: string;
	operationKey?: string;
}

export interface FinanceOpsMetric {
	label: string;
	value: string;
	detail: string;
}

export interface FinanceOpsStageCard extends FinanceOpsMetric {
	screen: FinanceOpsPreviewScreenId;
}

export interface AdoptionUsageView {
	dataRisk: string;
	humanValidated: boolean;
	quality: string;
	result: AiAdoptionUsageResult;
	team: string;
	timeAfterMinutes: number;
	timeBeforeMinutes: number;
	useCase: string;
	workflowKey: string;
}

export interface FinanceOpsPreviewModel {
	adoption: {
		recommendations: readonly AdoptionNextStep[];
		totalHoursSaved: number;
		totalMinutesSaved: number;
		usages: readonly AdoptionUsageView[];
	};
	cash: {
		actions: readonly Record<string, unknown>[];
		priorities: readonly CashPriorityView[];
		result: CashAgingResult;
	};
	home: {
		metrics: readonly FinanceOpsMetric[];
		stageCards: readonly FinanceOpsStageCard[];
	};
	mission: {
		documents: readonly string[];
		planPhases: readonly Record<string, unknown>[];
		questions: readonly string[];
		result: MissionIntakeResult;
		risks: readonly string[];
	};
	procedure: {
		controls: readonly string[];
		kpis: readonly string[];
		openQuestions: readonly string[];
		result: ProcedureDraftResult;
		roles: readonly Record<string, unknown>[];
		steps: readonly string[];
	};
	reporting: {
		followUps: readonly string[];
		highlights: readonly Record<string, unknown>[];
		kpis: readonly Record<string, unknown>[];
		questions: readonly string[];
		result: ReportingNarrativeResult;
	};
	reviewPanel: {
		cashDecision: string;
		decisionMoment: string;
		nextWorkflow: string;
		presenterAngle: string;
	};
	scenario: FinanceOpsDemoScenario;
	screens: readonly FinanceOpsPreviewScreen[];
}

export const financeOpsPreviewScreens: readonly FinanceOpsPreviewScreen[] = [
	{ id: 'home', label: 'Mission control' },
	{
		id: 'mission',
		label: 'Mission intake',
		operationKey: 'financeOps.missionIntake.triage',
	},
	{
		id: 'cash',
		label: 'Cash aging',
		operationKey: 'financeOps.cashAging.prioritize',
	},
	{
		id: 'procedure',
		label: 'Procedure',
		operationKey: 'financeOps.procedureDraft.create',
	},
	{
		id: 'reporting',
		label: 'Reporting',
		operationKey: 'financeOps.reportingNarrative.compose',
	},
	{
		id: 'adoption',
		label: 'Adoption ROI',
		operationKey: 'financeOps.aiAdoption.logUsage',
	},
];

export function buildFinanceOpsPreviewModel(
	scenarioId: FinanceOpsDemoScenario['id'] = defaultFinanceOpsDemoScenario.id
): FinanceOpsPreviewModel {
	const scenario = resolveScenario(scenarioId);
	const mission = triageMissionIntake(scenario.fixtures.mission);
	const cash = prioritizeCashAging(scenario.fixtures.cash);
	const procedure = createProcedureDraft(scenario.fixtures.procedure);
	const reporting = composeReportingNarrative(scenario.fixtures.reporting);
	const usages = scenario.fixtures.adoption.map((fixture) => ({
		dataRisk: fixture.dataRisk,
		humanValidated:
			fixture.humanValidated === true || fixture.humanValidated === 'true',
		quality: fixture.qualityRating,
		result: logAiAdoptionUsage(fixture),
		team: fixture.team,
		timeAfterMinutes: parseNumberSafely(fixture.timeAfterMinutes),
		timeBeforeMinutes: parseNumberSafely(fixture.timeBeforeMinutes),
		useCase: fixture.useCase,
		workflowKey: fixture.workflowKey,
	}));
	const totalMinutesSaved = usages.reduce(
		(sum, item) => sum + item.result.estimatedMinutesSaved,
		0
	);

	return {
		adoption: {
			recommendations: uniqueNextSteps(
				usages.map((item) => item.result.recommendedNextStep)
			),
			totalHoursSaved: round2(totalMinutesSaved / 60),
			totalMinutesSaved,
			usages,
		},
		cash: {
			actions: parseRecordList(cash.actionsJson),
			priorities: parseRecordList(cash.topPrioritiesJson).map((item) =>
				toCashPriorityView(item, cash.currency)
			),
			result: cash,
		},
		home: {
			metrics: [
				{ label: 'Workflows', value: '5', detail: 'contract operations' },
				{
					label: 'Client frame',
					value: scenario.clientProfile.split(' · ')[0] ?? scenario.label,
					detail: scenario.clientProfile,
				},
				{
					label: 'Cash exposure',
					value: formatMoney(cash.totalExposure, cash.currency),
					detail: `${formatMoney(cash.overdueExposure, cash.currency)} overdue`,
				},
				{
					label: 'ROI signal',
					value: `${round2(totalMinutesSaved / 60)} h`,
					detail: `${totalMinutesSaved} minutes saved in fixtures`,
				},
			],
			stageCards: financeOpsPreviewScreens.slice(1).map((screen) => ({
				label: screen.label,
				screen: screen.id,
				value: screen.operationKey ?? screen.id,
				detail: stageDetail(screen.id),
			})),
		},
		mission: {
			documents: parseStringList(mission.documentsToRequestJson),
			planPhases: parseRecordList(mission.thirtySixtyNinetyPlanJson),
			questions: parseStringList(mission.questionsForExecutiveJson),
			result: mission,
			risks: parseStringList(mission.risksJson),
		},
		procedure: {
			controls: parseStringList(procedure.controlsJson),
			kpis: parseStringList(procedure.kpisJson),
			openQuestions: parseStringList(procedure.openQuestionsJson),
			result: procedure,
			roles: parseRecordList(procedure.rolesAndResponsibilitiesJson),
			steps: parseStringList(procedure.stepByStepProcedureJson),
		},
		reporting: {
			followUps: parseStringList(reporting.recommendedFollowUpsJson),
			highlights: parseRecordList(reporting.varianceHighlightsJson),
			kpis: parseRecordList(scenario.fixtures.reporting.kpiSnapshotJson),
			questions: parseStringList(reporting.questionsForReviewJson),
			result: reporting,
		},
		reviewPanel: {
			cashDecision: cash.workflowDecision,
			decisionMoment: scenario.decisionMoment,
			nextWorkflow: mission.suggestedNextWorkflow,
			presenterAngle: scenario.presenterAngle,
		},
		scenario,
		screens: financeOpsPreviewScreens,
	};
}

function resolveScenario(
	id: FinanceOpsDemoScenario['id']
): FinanceOpsDemoScenario {
	return (
		financeOpsDemoScenarios.find((scenario) => scenario.id === id) ??
		defaultFinanceOpsDemoScenario
	);
}

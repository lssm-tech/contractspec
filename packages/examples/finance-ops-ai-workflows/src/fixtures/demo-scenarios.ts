import type {
	AiAdoptionUsageInput,
	CashAgingInput,
	MissionIntakeInput,
	ProcedureDraftInput,
	ReportingNarrativeInput,
} from '../handlers';
import {
	adoptionUsageFixtures,
	reportingResetAdoptionUsageFixtures,
} from './adoption-usage.fixture';
import {
	cashAgingFixture,
	reportingResetCashAgingFixture,
} from './cash-aging.fixture';
import {
	missionIntakeFixture,
	reportingResetMissionFixture,
} from './mission-intake.fixture';
import {
	procedureDraftFixture,
	reportingResetProcedureDraftFixture,
} from './procedure-notes.fixture';
import {
	reportingNarrativeFixture,
	reportingResetNarrativeFixture,
} from './reporting-snapshot.fixture';

export interface FinanceOpsDemoScenario {
	id: 'pme-recovery' | 'reporting-reset';
	label: string;
	oneLine: string;
	presenterAngle: string;
	clientProfile: string;
	decisionMoment: string;
	fixtures: {
		adoption: readonly AiAdoptionUsageInput[];
		cash: CashAgingInput;
		mission: MissionIntakeInput;
		procedure: ProcedureDraftInput;
		reporting: ReportingNarrativeInput;
	};
}

const pmeRecoveryScenario: FinanceOpsDemoScenario = {
	id: 'pme-recovery',
	label: 'PME recovery scenario',
	oneLine:
		'RAF departure, cash tension, missing reporting and fragmented tools.',
	presenterAngle:
		'Show how a consulting mission can move from urgent intake to cash priorities, operating procedures, reporting rhythm and adoption ROI.',
	clientProfile: 'Industrial PME · 85 employees · 14 M EUR revenue',
	decisionMoment:
		'The CEO needs a credible first 30 days before approving a broader finance transformation pilot.',
	fixtures: {
		adoption: adoptionUsageFixtures,
		cash: cashAgingFixture,
		mission: missionIntakeFixture,
		procedure: procedureDraftFixture,
		reporting: reportingNarrativeFixture,
	},
};

const reportingResetScenario: FinanceOpsDemoScenario = {
	id: 'reporting-reset',
	label: 'Reporting reset scenario',
	oneLine:
		'Fast-growing service business preparing reporting discipline before funding.',
	presenterAngle:
		'Show a less urgent but highly valuable operating-rhythm engagement around reporting, close procedure and AI adoption discipline.',
	clientProfile: 'B2B services scaleup · 42 employees · 6 M EUR revenue',
	decisionMoment:
		'Leadership wants a structured reporting cadence before sharing numbers with external stakeholders.',
	fixtures: {
		adoption: reportingResetAdoptionUsageFixtures,
		cash: reportingResetCashAgingFixture,
		mission: reportingResetMissionFixture,
		procedure: reportingResetProcedureDraftFixture,
		reporting: reportingResetNarrativeFixture,
	},
};

export const financeOpsDemoScenarios: readonly FinanceOpsDemoScenario[] = [
	pmeRecoveryScenario,
	reportingResetScenario,
] as const;

export const defaultFinanceOpsDemoScenario = pmeRecoveryScenario;

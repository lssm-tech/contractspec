import type {
	MissionIntakeInput,
	MissionPriority,
} from './finance-ops-ai-workflows.types';
import { includesAny } from './finance-ops-ai-workflows.utils';

const HIGH_PRIORITY_TERMS = [
	'urgent',
	'critical',
	'crisis',
	'redressement',
	'retournement',
	'cash',
	'trésorerie',
	'treasury',
	'rupture',
	'départ',
	'vacant',
	'manager absent',
] as const;

export function classifyMissionPriority(
	text: string,
	painPoints: string
): MissionPriority {
	if (includesAny(text, HIGH_PRIORITY_TERMS)) return 'high';
	if (
		includesAny(painPoints.toLowerCase(), [
			'reporting',
			'process',
			'procédure',
			'procedure',
			'contrôle',
			'controle',
			'budget',
			'forecast',
			'business plan',
		])
	) {
		return 'medium';
	}
	return 'low';
}

export function classifyMissionType(text: string): string {
	if (includesAny(text, ['cash', 'trésorerie', 'treasury', 'bfr', 'relance'])) {
		return 'Cash management / finance recovery';
	}
	if (
		includesAny(text, ['daf', 'direction financière', 'raf', 'finance manager'])
	) {
		return 'DAF transition / finance leadership';
	}
	if (
		includesAny(text, ['reporting', 'contrôle de gestion', 'power bi', 'bi'])
	) {
		return 'Reporting and management control';
	}
	if (includesAny(text, ['process', 'procédure', 'administratif'])) {
		return 'Finance process improvement';
	}
	return 'Finance transformation intake';
}

export function buildMissionRisks(text: string): string[] {
	const risks = [
		['cash tension', ['cash', 'trésorerie', 'treasury']],
		['missing reporting', ['reporting', 'no monthly']],
		['leadership vacancy', ['départ', 'vacant', 'manager absent', 'raf']],
		['overdue receivables', ['overdue', 'relance', 'receivables']],
		['weak internal controls', ['contrôle', 'controle', 'approval']],
		['unclear data quality', ['excel', 'fragmented', 'manual']],
		['operational continuity', ['continuity', 'crisis', 'rupture']],
		['stakeholder alignment', ['ceo', 'executive', 'board']],
		['tool fragmentation', ['power bi', 'erp', 'spreadsheet', 'excel']],
	] as const;
	return risks
		.filter(([, terms]) => includesAny(text, terms))
		.map(([risk]) => risk);
}

export function buildDocumentsToRequest(text: string): string[] {
	const docs = [
		'latest trial balance or management accounts, if available',
		'organization chart / finance team roles',
		'latest reporting package, if available',
		'current finance process notes',
		'access map for key systems',
	];
	if (includesAny(text, ['cash', 'trésorerie', 'treasury', 'bfr', 'relance'])) {
		docs.push(
			'aged receivables',
			'aged payables',
			'cash forecast',
			'bank position',
			'payment calendar',
			'collection process'
		);
	}
	if (includesAny(text, ['reporting', 'power bi', 'forecast', 'budget'])) {
		docs.push(
			'monthly reporting pack',
			'KPI definitions',
			'budget / forecast files',
			'Power BI or spreadsheet models',
			'chart of accounts mapping'
		);
	}
	if (includesAny(text, ['process', 'procédure', 'procedure', 'closing'])) {
		docs.push(
			'internal procedures',
			'approval matrices',
			'role descriptions',
			'closing calendar',
			'controls checklist'
		);
	}
	return docs;
}

export function buildMissingInformation(input: MissionIntakeInput): string[] {
	return [
		!input.revenueBand ? 'revenue band' : '',
		!input.industry ? 'industry' : '',
		!input.knownSystems ? 'known systems' : '',
		!input.availableDocuments ? 'available documents' : '',
		'validation owner',
	].filter(Boolean);
}

export function buildExecutiveQuestions(): string[] {
	return [
		'What business outcome defines success?',
		'What is urgent this week versus this quarter?',
		'What is the current cash exposure?',
		'What reporting rhythm does management need?',
		'Which decisions remain human-owned?',
		'Who is available in the finance team?',
		'Which systems are authoritative?',
		'What constraints cannot be changed?',
		'What evidence must be reviewed first?',
		'Who validates the final mission scope?',
	];
}

export function buildThirtySixtyNinetyPlan() {
	return {
		days_0_30: {
			objectives: ['stabilize', 'map risks', 'restore review cadence'],
			actions: [
				'collect documents',
				'interview finance owner',
				'rank urgent workflows',
			],
			deliverables: ['triage note', 'risk register', 'document request list'],
			validation_points: ['sponsor review', 'scope confirmation'],
		},
		days_31_60: {
			objectives: ['standardize', 'pilot deterministic workflows'],
			actions: [
				'draft procedures',
				'run cash aging review',
				'compose reporting narrative',
			],
			deliverables: ['procedure drafts', 'cash action pack', 'reporting pack'],
			validation_points: ['finance owner sign-off', 'management review'],
		},
		days_61_90: {
			objectives: ['industrialize', 'measure ROI', 'prepare adoption roadmap'],
			actions: ['train users', 'log adoption', 'define approval rules'],
			deliverables: ['ROI log', 'training notes', 'pilot roadmap'],
			validation_points: ['executive go/no-go', 'policy review'],
		},
	};
}

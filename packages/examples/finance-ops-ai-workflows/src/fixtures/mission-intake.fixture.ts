import type { MissionIntakeInput } from '../handlers';

export const missionIntakeFixture: MissionIntakeInput = {
	clientName: 'PME Industrie Demo',
	companyContext:
		"PME industrielle de 85 personnes avec chiffre d'affaires de 14 M EUR.",
	companySize: '85 employees',
	revenueBand: '14 M EUR',
	industry: 'Industrial manufacturing',
	situationSummary:
		'Sudden RAF departure, no monthly reporting for 4 months, cash tension, irregular receivables follow-up.',
	painPoints:
		'Excel and Power BI fragmented tools, weak cash visibility, missing reporting rhythm, unclear process ownership.',
	requestedOutcome:
		'Stabilize finance function, restore reporting, and create safe AI-assisted workflows.',
	urgency: 'urgent cash and reporting continuity',
	dataSensitivity: 'medium',
	knownSystems: 'Excel, Power BI, ERP export',
	availableDocuments: 'partial trial balance, fragmented reporting pack',
};

export const reportingResetMissionFixture: MissionIntakeInput = {
	clientName: 'Scaleup Services Demo',
	companyContext:
		'Société de services B2B de 42 personnes avec croissance rapide et closing mensuel instable.',
	companySize: '42 employees',
	revenueBand: '6 M EUR',
	industry: 'B2B services',
	situationSummary:
		'Management wants a reliable monthly reporting rhythm, clearer budget ownership, and documented finance processes before a funding discussion.',
	painPoints:
		'Reporting definitions are inconsistent, closing tasks are informal, budget owners challenge numbers, and process documentation is missing.',
	requestedOutcome:
		'Create a structured finance operating rhythm with reporting narrative, procedure draft, and adoption ROI tracking.',
	urgency: 'medium process and reporting reset',
	dataSensitivity: 'medium',
	knownSystems: 'ERP export, spreadsheets, BI prototype',
	availableDocuments: 'budget file, draft KPI deck, closing checklist notes',
};

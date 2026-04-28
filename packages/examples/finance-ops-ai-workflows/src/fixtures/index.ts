import type {
	AiAdoptionUsageInput,
	CashAgingInput,
	MissionIntakeInput,
	ProcedureDraftInput,
	ReportingNarrativeInput,
} from '../handlers';

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

export const cashAgingFixture: CashAgingInput = {
	snapshotId: 'aging-demo-2026-04',
	snapshotDate: '2026-04-28',
	currency: 'EUR',
	reviewOwner: 'Finance owner',
	dataSensitivity: 'medium',
	rowsJson: JSON.stringify([
		{
			clientName: 'Atelier Demo',
			invoiceId: 'INV-1001',
			dueDate: '2026-02-20',
			amount: 18_500,
			owner: 'Sales lead',
			disputeStatus: 'none',
			notes: 'High amount overdue more than 30 days.',
		},
		{
			clientName: 'Northwind Sample',
			invoiceId: 'INV-1002',
			dueDate: '2026-01-30',
			amount: 24_000,
			owner: 'Finance manager',
			disputeStatus: 'pricing dispute',
			notes: 'Client disputes invoice line.',
		},
		{
			clientName: 'Lagoon Demo',
			invoiceId: 'INV-1003',
			dueDate: '2026-04-01',
			amount: 7_500,
			owner: 'Account owner',
			disputeStatus: 'none',
			notes: 'Medium overdue.',
		},
		{
			clientName: 'Cobalt Test',
			invoiceId: 'INV-1004',
			dueDate: '2026-04-20',
			amount: 1_200,
			owner: 'Admin',
			disputeStatus: 'none',
			notes: 'Low routine follow-up.',
		},
		{
			clientName: 'Blue Sample',
			invoiceId: 'INV-1005',
			dueDate: '2026-03-25',
			amount: 4_800,
			owner: 'Shared mailbox',
			disputeStatus: 'none',
			notes: 'Note is messy but date is valid.',
		},
		{
			clientName: 'Recent Demo',
			invoiceId: 'INV-1006',
			dueDate: '2026-05-10',
			amount: 9_000,
			owner: 'Sales',
			disputeStatus: 'none',
			notes: 'Recent invoice not overdue.',
		},
	]),
};

export const procedureDraftFixture: ProcedureDraftInput = {
	procedureName: 'Client collection follow-up',
	processArea: 'cash receivables relance',
	rawNotes:
		'Invoices sent weekly. Disputes stay in emails. Owner unclear. Reminders irregular. CEO wants weekly cash visibility. No escalation rule. No KPI.',
	stakeholders: 'CEO, finance owner, sales lead, admin',
	frequency: 'weekly',
	knownRisks: 'payment promises not tracked, disputes not owned',
	dataSensitivity: 'medium',
};

export const reportingNarrativeFixture: ReportingNarrativeInput = {
	reportingPeriod: 'April 2026',
	currency: 'EUR',
	audience: 'CEO and finance owner',
	dataSensitivity: 'medium',
	knownContext: '',
	kpiSnapshotJson: JSON.stringify([
		{
			metric: 'Revenue',
			currentValue: 1_120_000,
			previousValue: 1_050_000,
			targetValue: 1_180_000,
			unit: 'EUR',
			owner: 'Sales',
		},
		{
			metric: 'Gross margin',
			currentValue: 31,
			previousValue: 34,
			targetValue: 35,
			unit: '%',
			owner: 'Finance',
		},
		{
			metric: 'Operating expenses',
			currentValue: 420_000,
			previousValue: 390_000,
			targetValue: 400_000,
			unit: 'EUR',
			owner: 'Finance',
		},
		{
			metric: 'Cash balance',
			currentValue: 210_000,
			previousValue: 290_000,
			targetValue: 260_000,
			unit: 'EUR',
			owner: 'CEO',
		},
		{
			metric: 'DSO',
			currentValue: 67,
			previousValue: 58,
			targetValue: 52,
			unit: 'days',
			owner: 'Finance',
		},
	]),
};

export const adoptionUsageFixtures: readonly AiAdoptionUsageInput[] = [
	{
		workflowKey: 'financeOps.missionIntake.triage',
		team: 'finance ops',
		useCase: 'mission intake triage',
		timeBeforeMinutes: 90,
		timeAfterMinutes: 35,
		dataRisk: 'low',
		humanValidated: true,
		qualityRating: 'high',
	},
	{
		workflowKey: 'financeOps.cashAging.prioritize',
		team: 'cash',
		useCase: 'cash prioritization',
		timeBeforeMinutes: 120,
		timeAfterMinutes: 45,
		dataRisk: 'medium',
		humanValidated: true,
		qualityRating: 'high',
	},
	{
		workflowKey: 'financeOps.procedureDraft.create',
		team: 'operations',
		useCase: 'procedure draft',
		timeBeforeMinutes: 180,
		timeAfterMinutes: 80,
		dataRisk: 'low',
		humanValidated: true,
		qualityRating: 'medium',
	},
	{
		workflowKey: 'financeOps.reportingNarrative.compose',
		team: 'control',
		useCase: 'sensitive management narrative',
		timeBeforeMinutes: 75,
		timeAfterMinutes: 60,
		dataRisk: 'high',
		humanValidated: true,
		qualityRating: 'medium',
	},
	{
		workflowKey: 'training-support',
		team: 'finance',
		useCase: 'training support',
		timeBeforeMinutes: 30,
		timeAfterMinutes: 35,
		dataRisk: 'low',
		humanValidated: false,
		qualityRating: 'low',
	},
] as const;

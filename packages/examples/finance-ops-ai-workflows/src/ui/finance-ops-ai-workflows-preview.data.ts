export const financeOpsWorkflowMetrics = [
	{ label: 'Operations', value: '5', detail: 'ContractSpec commands' },
	{ label: 'Demo client', value: 'PME 85', detail: '14 M EUR revenue' },
	{ label: 'Safety', value: 'Review', detail: 'Human approval required' },
] as const;

export const financeOpsWorkflowCards = [
	{
		key: 'financeOps.missionIntake.triage',
		title: 'Mission intake triage',
		description:
			'Frames a fictive DAF transition brief into mission type, priority, risks, questions and 30/60/90 plan.',
		outputs: ['mission scope', 'documents', 'executive questions'],
	},
	{
		key: 'financeOps.cashAging.prioritize',
		title: 'Cash aging prioritization',
		description:
			'Ranks receivables with fixed rules, dispute-first actions, exposure totals and finance-owner validation.',
		outputs: ['cash exposure', 'top priorities', 'safe actions'],
	},
	{
		key: 'financeOps.procedureDraft.create',
		title: 'Procedure draft',
		description:
			'Turns messy collection notes into roles, steps, controls, KPIs and open questions for management validation.',
		outputs: ['roles', 'controls', 'training notes'],
	},
	{
		key: 'financeOps.reportingNarrative.compose',
		title: 'Reporting narrative',
		description:
			'Converts KPI snapshots into deterministic variance highlights without inventing missing causes.',
		outputs: ['variance review', 'questions', 'follow-ups'],
	},
	{
		key: 'financeOps.aiAdoption.logUsage',
		title: 'AI adoption ROI log',
		description:
			'Measures workflow-level time savings, policy risk and standardization readiness without employee surveillance.',
		outputs: ['ROI', 'policy review', 'next step'],
	},
] as const;

export const financeOpsSafetyChecklist = [
	'No LLM calls',
	'No external API calls',
	'No email sending',
	'Fictive data only',
	'No autonomous finance decision',
	'Human review required',
	'Not financial, legal, tax or accounting advice',
] as const;

export const financeOpsDemoFlow = [
	'Import fictive fixtures',
	'Run mission intake',
	'Prioritize cash aging',
	'Draft procedure and reporting narrative',
	'Log AI adoption ROI',
] as const;

export const financeOpsAgingRows = [
	{
		invoiceId: 'INV-1002',
		counterparty: 'Northwind Sample',
		amountDue: '24,000 EUR',
		daysLate: 88,
		priority: 'dispute',
		action: 'Clarify dispute before follow-up',
	},
	{
		invoiceId: 'INV-1001',
		counterparty: 'Atelier Demo',
		amountDue: '18,500 EUR',
		daysLate: 67,
		priority: 'high',
		action: 'Prepare executive escalation draft',
	},
] as const;

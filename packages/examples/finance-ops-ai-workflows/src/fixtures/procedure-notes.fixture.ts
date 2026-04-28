import type { ProcedureDraftInput } from '../handlers';

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

export const reportingResetProcedureDraftFixture: ProcedureDraftInput = {
	procedureName: 'Monthly reporting close',
	processArea: 'reporting closing monthly',
	rawNotes:
		'Controller exports ERP data, BI prototype updated manually, CEO deck due every month, budget owners review late, comments spread across files.',
	stakeholders: 'CEO, controller, budget owners, operations lead',
	frequency: 'monthly',
	knownRisks: 'late validation, inconsistent KPI definitions, weak sign-off',
	dataSensitivity: 'medium',
};

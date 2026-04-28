import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const FinanceOpsAiWorkflowsFeature = defineFeature({
	meta: {
		key: 'finance-ops-ai-workflows',
		version: '1.0.0',
		title: 'Finance Ops AI Workflows',
		description:
			'Deterministic finance-ops workflows for mission triage, cash prioritization, procedure drafting, reporting narrative, and AI adoption ROI.',
		domain: 'finance-ops',
		owners: ['@platform.finance-ops'],
		tags: [
			'finance',
			'finance-ops',
			'workflow',
			'agents',
			'human-review',
			'cash-management',
			'reporting',
			'adoption',
			'roi',
		],
		stability: 'beta',
	},
	operations: [
		{ key: 'financeOps.missionIntake.triage', version: '1.0.0' },
		{ key: 'financeOps.cashAging.prioritize', version: '1.0.0' },
		{ key: 'financeOps.procedureDraft.create', version: '1.0.0' },
		{ key: 'financeOps.reportingNarrative.compose', version: '1.0.0' },
		{ key: 'financeOps.aiAdoption.logUsage', version: '1.0.0' },
	],
	docs: [
		'docs.examples.finance-ops-ai-workflows',
		'docs.examples.finance-ops-ai-workflows.usage',
		'docs.examples.finance-ops-ai-workflows.demo-script',
	],
});

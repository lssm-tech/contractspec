import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesFinanceOpsAiWorkflowsExample = defineExample({
	meta: {
		key: 'finance-ops-ai-workflows',
		version: '1.0.0',
		title: 'Finance Ops AI Workflows',
		description:
			'Safe finance operations AI workflow example with mission intake triage, cash prioritization, procedure drafting, reporting narrative, human review, and adoption ROI logging.',
		summary:
			'A ContractSpec template for safe, deterministic, human-reviewed AI-assisted finance operations workflows.',
		kind: 'template',
		visibility: 'public',
		stability: 'beta',
		owners: ['@platform.finance-ops'],
		tags: [
			'package',
			'examples',
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
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.finance-ops-ai-workflows',
		docs: './docs',
	},
});

export default ExamplesFinanceOpsAiWorkflowsExample;
export { ExamplesFinanceOpsAiWorkflowsExample };

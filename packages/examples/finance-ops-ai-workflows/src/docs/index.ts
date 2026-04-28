import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

export const financeOpsAiWorkflowsDocBlocks: DocBlock[] = [
	{
		id: 'docs.examples.finance-ops-ai-workflows',
		title: 'Finance Ops AI Workflows',
		summary:
			'Governed finance-ops template with deterministic mission triage, cash prioritization, procedure drafting, reporting narrative, and AI adoption ROI logging.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/examples/finance-ops-ai-workflows',
		tags: [
			'finance',
			'finance-ops',
			'workflow',
			'human-review',
			'cash-management',
			'reporting',
			'roi',
		],
		body: `## Positioning
Finance Ops AI Workflows demonstrates how to turn finance, DAF, cash, reporting, procedures, and adoption needs into ContractSpec workflows: explicit inputs, deterministic handlers, reviewable outputs, and replayable proof.

## Included operations
- \`financeOps.missionIntake.triage\` frames a fictive DAF / finance transformation mission.
- \`financeOps.cashAging.prioritize\` ranks synthetic aged receivables with fixed rules and reference date \`2026-04-28\`.
- \`financeOps.procedureDraft.create\` turns messy finance process notes into a review draft with controls.
- \`financeOps.reportingNarrative.compose\` converts KPI snapshots into management reporting narrative helpers.
- \`financeOps.aiAdoption.logUsage\` logs AI workflow usage, estimated time saved, and governance next steps.

## Safety posture
The package uses synthetic fixtures and deterministic handlers only. Keep confidential client content out of fixtures and usage logs. Outputs are review drafts, not financial, legal, tax, accounting, or investment advice, and human review is mandatory before client-facing or operational use.`,
	},
	{
		id: 'docs.examples.finance-ops-ai-workflows.usage',
		title: 'Finance Ops AI Workflows Usage',
		summary:
			'How to validate, replay, and extend the governed finance-ops workflow template.',
		kind: 'usage',
		visibility: 'public',
		route: '/docs/examples/finance-ops-ai-workflows/usage',
		tags: ['finance', 'usage', 'workflow', 'proof'],
		body: `## Demo flow
1. Open the website template Preview button and select a fixture scenario.
2. Start from the Mission control screen to explain the business context.
3. Open Mission intake and Cash aging to show scoping, risks, priorities, and reviewable action packs.
4. Open Procedure and Reporting to show operational artifacts beyond prompt text.
5. Open Adoption ROI to show measurable, policy-aware workflow adoption.

## Validation
- Run \`bun run preflight\` in the package.
- Run \`runFinanceOpsAiWorkflowsReplay()\` from \`./proof\` to replay all five workflows on synthetic fixtures.
- Use the website template Preview button to inspect the multi-screen inline demo surface.

## Extension rules
- Keep calculations deterministic unless a future contract explicitly separates model-assisted drafting from rule-based decisions.
- Keep human approval, policy review, and data-risk constraints visible in outputs.
- Add real integrations only behind approved contracts, allowlists, and anonymized or explicitly authorized data.`,
	},
	{
		id: 'docs.examples.finance-ops-ai-workflows.demo-script',
		title: 'Demo Script And Prompt To Template',
		summary:
			'Explains the commercial demo script and why the template is a governed workflow proof, not a prompt collection.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/examples/finance-ops-ai-workflows/prompt-to-template',
		tags: ['workflow', 'agents', 'governance'],
		body: `## Commercial demo script
Use the template to show a DAF / finance-ops leader the difference between prompt usage and governed workflow industrialization:

1. Start from the fictive PME brief and run mission intake triage.
2. Show the deterministic cash aging pack and explain that no model decides who to chase.
3. Show procedure and reporting drafts as reviewable management support.
4. Show the AI adoption log as ROI and policy tracking for use cases, not people.
5. Close on the industrialization path: approved data, approval queue, policy layer, and real integrations behind contracts.

## Progression
- Prompt: a punctual AI request, useful but not governed.
- Workflow: input, rules, processing, output, validation, and log.
- Governed agent: a simulated or future AI lane that can operate only inside contracts, allowlisted tools, and review rules.
- ContractSpec template: a reproducible proof with explicit operations, testable handlers, reviewable outputs, and verifiable governance.

The value is not making a model talk. The value is shaping the finance operation, separating deterministic rules from assisted drafting, blocking autonomous decisions, measuring gains, and preparing industrialization.`,
	},
];

registerDocBlocks(financeOpsAiWorkflowsDocBlocks);

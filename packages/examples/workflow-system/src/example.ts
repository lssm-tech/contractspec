import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesWorkflowSystemExample = defineExample({
	meta: {
		key: 'workflow-system',
		version: '1.0.0',
		title: 'Workflow System',
		description:
			'Workflow and approval system example for ContractSpec - State machine with role-based transitions',
		kind: 'template',
		visibility: 'public',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'workflow-system'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.workflow-system',
	},
});

export default ExamplesWorkflowSystemExample;
export { ExamplesWorkflowSystemExample };

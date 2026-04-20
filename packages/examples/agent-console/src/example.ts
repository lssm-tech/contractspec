import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesAgentConsoleExample = defineExample({
	meta: {
		key: 'agent-console',
		version: '1.0.0',
		title: 'Agent Console',
		description:
			'Agent Console example - AI agent orchestration with tools, runs, and logs',
		kind: 'template',
		visibility: 'public',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'agent-console', 'agents', 'autonomous'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.agent-console',
	},
});

export default ExamplesAgentConsoleExample;
export { ExamplesAgentConsoleExample };

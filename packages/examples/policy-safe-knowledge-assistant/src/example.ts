import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesPolicySafeKnowledgeAssistantExample = defineExample({
	meta: {
		key: 'examples.policy-safe-knowledge-assistant',
		version: '1.0.0',
		title: 'Policy Safe Knowledge Assistant',
		description:
			'All-in-one template example: policy-safe knowledge assistant with locale/jurisdiction gating, versioned KB snapshots, HITL update pipeline, and learning hub.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'policy-safe-knowledge-assistant'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.policy-safe-knowledge-assistant',
	},
});

export default ExamplesPolicySafeKnowledgeAssistantExample;
export { ExamplesPolicySafeKnowledgeAssistantExample };

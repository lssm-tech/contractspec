import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesVersionedKnowledgeBaseExample = defineExample({
	meta: {
		key: 'examples.versioned-knowledge-base',
		version: '1.0.0',
		title: 'Versioned Knowledge Base',
		description:
			'Example: curated, versioned knowledge base with immutable sources, rule versions, and published snapshots.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'versioned-knowledge-base'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.versioned-knowledge-base',
	},
});

export default ExamplesVersionedKnowledgeBaseExample;
export { ExamplesVersionedKnowledgeBaseExample };

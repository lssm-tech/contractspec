import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesKnowledgeCanonExample = defineExample({
	meta: {
		key: 'examples.knowledge-canon',
		version: '1.0.0',
		title: 'Knowledge Canon',
		description:
			'Knowledge example – Product Canon space (blueprint + tenant config + source sample + runtime helper).',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'knowledge-canon'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.knowledge-canon',
	},
});

export default ExamplesKnowledgeCanonExample;
export { ExamplesKnowledgeCanonExample };

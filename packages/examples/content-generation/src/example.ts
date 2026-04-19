import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesContentGenerationExample = defineExample({
	meta: {
		key: 'examples.content-generation',
		version: '1.0.0',
		title: 'Content Generation',
		description:
			'Content generation example using @contractspec/lib.content-gen.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'content-generation'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.content-generation',
	},
});

export default ExamplesContentGenerationExample;
export { ExamplesContentGenerationExample };

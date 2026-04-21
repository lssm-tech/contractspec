import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesMinimalExample = defineExample({
	meta: {
		key: 'minimal',
		version: '1.0.0',
		title: 'Minimal',
		description:
			'ContractSpec package declaration for @contractspec/example.minimal.',
		kind: 'template',
		visibility: 'public',
		stability: 'stable',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'minimal', 'quickstart'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.minimal',
	},
});

export default ExamplesMinimalExample;
export { ExamplesMinimalExample };

import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesMinimalExample = defineExample({
	meta: {
		key: 'examples.minimal',
		version: '1.0.0',
		title: 'Minimal',
		description:
			'ContractSpec package declaration for @contractspec/example.minimal.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'minimal'],
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

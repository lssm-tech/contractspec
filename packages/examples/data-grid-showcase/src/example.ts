import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesDataGridShowcaseExample = defineExample({
	meta: {
		key: 'examples.data-grid-showcase',
		version: '1.0.0',
		title: 'Data Grid Showcase',
		description:
			'Focused data-grid example for ContractSpec table capabilities',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'data-grid-showcase'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.data-grid-showcase',
	},
});

export default ExamplesDataGridShowcaseExample;
export { ExamplesDataGridShowcaseExample };

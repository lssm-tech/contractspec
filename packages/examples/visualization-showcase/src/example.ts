import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesVisualizationShowcaseExample = defineExample({
	meta: {
		key: 'visualization-showcase',
		version: '1.0.0',
		title: 'Visualization Showcase',
		description:
			'Focused visualization showcase for ContractSpec primitives and design-system wrappers',
		kind: 'template',
		visibility: 'public',
		stability: 'stable',
		owners: ['@contractspec-core'],
		tags: [
			'package',
			'examples',
			'visualization-showcase',
			'visualization',
			'charts',
		],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.visualization-showcase',
	},
});

export default ExamplesVisualizationShowcaseExample;
export { ExamplesVisualizationShowcaseExample };

import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
	meta: {
		key: 'visualization-showcase',
		version: '1.0.0',
		title: 'Visualization Showcase',
		description:
			'Focused reference example for ContractSpec-owned visualization primitives and design-system wrappers.',
		kind: 'ui',
		visibility: 'public',
		stability: 'experimental',
		owners: ['@platform.core'],
		tags: ['visualization', 'charts', 'ui'],
	},
	docs: {
		rootDocId: 'docs.examples.visualization-showcase',
		goalDocId: 'docs.examples.visualization-showcase.goal',
		usageDocId: 'docs.examples.visualization-showcase.usage',
	},
	entrypoints: {
		packageName: '@contractspec/example.visualization-showcase',
		feature: './visualization-showcase.feature',
		docs: './docs',
		ui: './ui',
	},
	surfaces: {
		templates: true,
		sandbox: {
			enabled: true,
			modes: ['playground', 'specs', 'markdown', 'evolution'],
		},
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
});

export default example;

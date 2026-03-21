import { defineFeature } from '@contractspec/lib.contracts-spec';

export const DataGridShowcaseFeature = defineFeature({
	meta: {
		key: 'data-grid-showcase',
		version: '1.0.0',
		title: 'Data Grid Showcase',
		description:
			'Focused ContractSpec table example covering client mode, server mode, and DataView adapter paths.',
		domain: 'ui',
		owners: ['@platform.core'],
		tags: ['table', 'data-grid', 'ui', 'tanstack'],
		stability: 'experimental',
	},
	operations: [
		{
			key: 'examples.data-grid-showcase.rows.list',
			version: '1.0.0',
		},
	],
	dataViews: [
		{
			key: 'examples.data-grid-showcase.table',
			version: '1.0.0',
		},
	],
	docs: [
		'docs.examples.data-grid-showcase',
		'docs.examples.data-grid-showcase.goal',
		'docs.examples.data-grid-showcase.usage',
	],
});

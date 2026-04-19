import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesAnalyticsDashboardExample = defineExample({
	meta: {
		key: 'examples.analytics-dashboard',
		version: '1.0.0',
		title: 'Analytics Dashboard',
		description:
			'Analytics Dashboard example with widgets and query engine for ContractSpec',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'analytics-dashboard'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.analytics-dashboard',
	},
});

export default ExamplesAnalyticsDashboardExample;
export { ExamplesAnalyticsDashboardExample };

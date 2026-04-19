import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLifecycleDashboardExample = defineExample({
	meta: {
		key: 'examples.lifecycle-dashboard',
		version: '1.0.0',
		title: 'Lifecycle Dashboard',
		description:
			'Lifecycle dashboard example (snippet): how to call lifecycle-managed APIs and render a status card.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'lifecycle-dashboard'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.lifecycle-dashboard',
	},
});

export default ExamplesLifecycleDashboardExample;
export { ExamplesLifecycleDashboardExample };

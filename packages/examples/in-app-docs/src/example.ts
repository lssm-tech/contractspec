import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesInAppDocsExample = defineExample({
	meta: {
		key: 'examples.in-app-docs',
		version: '1.0.0',
		title: 'In App Docs',
		description:
			'Example showing how to use DocBlock for in-app documentation for non-technical users',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'in-app-docs'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.in-app-docs',
	},
});

export default ExamplesInAppDocsExample;
export { ExamplesInAppDocsExample };

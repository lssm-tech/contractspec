import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLifecycleCliExample = defineExample({
	meta: {
		key: 'examples.lifecycle-cli',
		version: '1.0.0',
		title: 'Lifecycle Cli',
		description:
			'Lifecycle CLI demo (example): run lifecycle assessment without an HTTP server.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'lifecycle-cli'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.lifecycle-cli',
	},
});

export default ExamplesLifecycleCliExample;
export { ExamplesLifecycleCliExample };

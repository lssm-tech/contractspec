import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesHarnessLabExample = defineExample({
	meta: {
		key: 'examples.harness-lab',
		version: '1.0.0',
		title: 'Harness Lab',
		description:
			'Focused harness example for ContractSpec scenarios, suites, orchestration, and runtime adapters.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'harness-lab'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.harness-lab',
	},
});

export default ExamplesHarnessLabExample;
export { ExamplesHarnessLabExample };

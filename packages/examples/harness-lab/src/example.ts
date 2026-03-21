import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
	meta: {
		key: 'harness-lab',
		version: '1.0.0',
		title: 'Harness Lab',
		description:
			'Focused harness example covering scenario contracts, suites, orchestration, and real runtime adapters.',
		kind: 'library',
		visibility: 'public',
		stability: 'experimental',
		owners: ['@platform.core'],
		tags: ['harness', 'evaluation', 'playwright', 'sandbox', 'runtime'],
	},
	docs: {
		rootDocId: 'docs.examples.harness-lab',
		usageDocId: 'docs.examples.harness-lab.usage',
		referenceDocId: 'docs.examples.harness-lab.reference',
	},
	entrypoints: {
		packageName: '@contractspec/example.harness-lab',
		feature: './harness-lab.feature',
		docs: './docs',
	},
	surfaces: {
		templates: false,
		sandbox: { enabled: true, modes: ['specs', 'markdown'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
});

export default example;

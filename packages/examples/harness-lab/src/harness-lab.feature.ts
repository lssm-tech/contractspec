import { defineFeature } from '@contractspec/lib.contracts-spec';

export const HarnessLabFeature = defineFeature({
	meta: {
		key: 'harness-lab',
		version: '1.0.0',
		title: 'Harness Lab',
		description:
			'Focused harness example for deterministic sandbox and browser evaluation flows.',
		domain: 'harness',
		owners: ['@examples'],
		tags: ['harness', 'runtime', 'evaluation'],
		stability: 'experimental',
	},
	docs: [
		'docs.examples.harness-lab',
		'docs.examples.harness-lab.usage',
		'docs.examples.harness-lab.reference',
	],
});

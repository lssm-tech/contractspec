import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const HarnessFeature = defineFeature({
	meta: {
		key: 'libs.harness',
		version: '1.0.0',
		title: 'Harness',
		description:
			'Harness orchestration, policy, evidence, and evaluation runtime.',
		domain: 'harness',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'harness'],
		stability: 'experimental',
	},
});

import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const TestingFeature = defineFeature({
	meta: {
		key: 'libs.testing',
		version: '1.0.0',
		title: 'Testing',
		description: 'Contract-aware testing utilities and runners',
		domain: 'testing',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'testing'],
		stability: 'experimental',
	},
});

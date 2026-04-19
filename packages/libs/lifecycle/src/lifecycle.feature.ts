import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const LifecycleFeature = defineFeature({
	meta: {
		key: 'libs.lifecycle',
		version: '1.0.0',
		title: 'Lifecycle',
		description: 'Contract lifecycle management primitives',
		domain: 'lifecycle',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'lifecycle'],
		stability: 'experimental',
	},
});

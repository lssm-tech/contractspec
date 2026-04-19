import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const AnalyticsFeature = defineFeature({
	meta: {
		key: 'libs.analytics',
		version: '1.0.0',
		title: 'Analytics',
		description: 'Product analytics and growth metrics',
		domain: 'analytics',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'analytics'],
		stability: 'experimental',
	},
});

import { defineFeature } from '@contractspec/lib.contracts-spec';

export const LifecycleDashboardFeature = defineFeature({
	meta: {
		key: 'lifecycle-dashboard',
		version: '1.0.0',
		title: 'Lifecycle Dashboard',
		description:
			'Lifecycle API usage snippet with status cards and lifecycle-managed endpoints',
		domain: 'lifecycle',
		owners: ['@examples'],
		tags: ['lifecycle', 'dashboard', 'status'],
		stability: 'experimental',
	},

	docs: ['docs.examples.lifecycle-dashboard'],
});

import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const CostTrackingFeature = defineFeature({
	meta: {
		key: 'libs.cost-tracking',
		version: '1.0.0',
		title: 'Cost Tracking',
		description: 'API cost tracking and budgeting',
		domain: 'cost-tracking',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'cost-tracking'],
		stability: 'experimental',
	},
});

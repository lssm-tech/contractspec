import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const MobileReviewFeature = defineFeature({
	meta: {
		key: 'modules.mobile-review',
		version: '1.0.0',
		title: 'Mobile Review',
		description: 'Reusable mobile-first Builder review surfaces.',
		domain: 'mobile-review',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'mobile-review'],
		stability: 'experimental',
	},
});

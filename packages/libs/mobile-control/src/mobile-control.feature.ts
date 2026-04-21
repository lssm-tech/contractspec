import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const MobileControlFeature = defineFeature({
	meta: {
		key: 'libs.mobile-control',
		version: '1.0.0',
		title: 'Mobile Control',
		description:
			'Builder mobile-control primitives for review cards, parity, and deep-link-safe actions.',
		domain: 'mobile-control',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'mobile-control'],
		stability: 'experimental',
	},
});

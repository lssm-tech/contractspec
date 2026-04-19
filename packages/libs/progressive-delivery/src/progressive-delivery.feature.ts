import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ProgressiveDeliveryFeature = defineFeature({
	meta: {
		key: 'libs.progressive-delivery',
		version: '1.0.0',
		title: 'Progressive Delivery',
		description:
			'ContractSpec package declaration for @contractspec/lib.progressive-delivery.',
		domain: 'progressive-delivery',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'progressive-delivery'],
		stability: 'experimental',
	},
});

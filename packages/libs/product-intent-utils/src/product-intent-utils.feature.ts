import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ProductIntentUtilsFeature = defineFeature({
	meta: {
		key: 'libs.product-intent-utils',
		version: '1.0.0',
		title: 'Product Intent Utils',
		description: 'Prompt builders and validators for product-intent workflows.',
		domain: 'product-intent-utils',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'product-intent-utils'],
		stability: 'experimental',
	},
});

import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ProductIntentCoreFeature = defineFeature({
	meta: {
		key: 'modules.product-intent-core',
		version: '1.0.0',
		title: 'Product Intent Core',
		description: 'Core product intent orchestration and adapters',
		domain: 'product-intent-core',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'product-intent-core'],
		stability: 'experimental',
	},
});

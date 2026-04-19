import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContextStorageFeature = defineFeature({
	meta: {
		key: 'libs.context-storage',
		version: '1.0.0',
		title: 'Context Storage',
		description: 'Context pack and snapshot storage primitives',
		domain: 'context-storage',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'context-storage'],
		stability: 'experimental',
	},
});

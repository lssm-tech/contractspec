import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContextStorageFeature = defineFeature({
	meta: {
		key: 'modules.context-storage',
		version: '1.0.0',
		title: 'Context Storage',
		description: 'Context storage module with persistence adapters',
		domain: 'context-storage',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'context-storage'],
		stability: 'experimental',
	},
});

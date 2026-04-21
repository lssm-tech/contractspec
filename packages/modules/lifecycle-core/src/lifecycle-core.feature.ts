import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const LifecycleCoreFeature = defineFeature({
	meta: {
		key: 'modules.lifecycle-core',
		version: '1.0.0',
		title: 'Lifecycle Core',
		description: 'Core lifecycle stage definitions and transitions',
		domain: 'lifecycle-core',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'lifecycle-core'],
		stability: 'experimental',
	},
});

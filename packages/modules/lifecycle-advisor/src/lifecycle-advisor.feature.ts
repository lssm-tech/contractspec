import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const LifecycleAdvisorFeature = defineFeature({
	meta: {
		key: 'modules.lifecycle-advisor',
		version: '1.0.0',
		title: 'Lifecycle Advisor',
		description: 'AI-powered lifecycle recommendations and guidance',
		domain: 'lifecycle-advisor',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'lifecycle-advisor'],
		stability: 'experimental',
	},
});

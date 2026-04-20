import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const MobileLandingFeature = defineFeature({
	meta: {
		key: 'mobile-demo.landing',
		version: '1.0.0',
		title: 'Mobile Landing Companion',
		description:
			'Expo landing companion for the shared ContractSpec OSS-first product story.',
		domain: 'mobile-demo',
		owners: ['@platform.core'],
		tags: ['mobile', 'expo', 'landing', 'marketing'],
		stability: 'experimental',
	},

	operations: [
		{ key: 'mobileLanding.story.get', version: '1.0.0' },
		{ key: 'mobileLanding.cta.resolve', version: '1.0.0' },
	],
});

import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContentGenFeature = defineFeature({
	meta: {
		key: 'libs.content-gen',
		version: '1.0.0',
		title: 'Content Gen',
		description: 'AI-powered content generation for blog, email, and social',
		domain: 'content-gen',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'content-gen'],
		stability: 'experimental',
	},
});

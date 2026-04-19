import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ImageGenFeature = defineFeature({
	meta: {
		key: 'libs.image-gen',
		version: '1.0.0',
		title: 'Image Gen',
		description:
			'AI-powered image generation for hero, social, thumbnail, OG, and illustration',
		domain: 'image-gen',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'image-gen'],
		stability: 'experimental',
	},
});

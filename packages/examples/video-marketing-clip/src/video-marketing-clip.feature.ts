import { defineFeature } from '@contractspec/lib.contracts-spec';

export const VideoMarketingClipFeature = defineFeature({
	meta: {
		key: 'video-marketing-clip',
		version: '1.0.0',
		title: 'Video Marketing Clips',
		description: 'Generate short-form marketing videos from content briefs',
		domain: 'video',
		owners: ['@examples'],
		tags: ['video', 'marketing', 'clips', 'content'],
		stability: 'experimental',
	},

	docs: [
		'docs.examples.video-marketing-clip',
		'docs.examples.video-marketing-clip.usage',
	],
});

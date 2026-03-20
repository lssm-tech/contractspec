import { defineFeature } from '@contractspec/lib.contracts-spec';

export const VideoDocsTerminalFeature = defineFeature({
	meta: {
		key: 'video-docs-terminal',
		version: '1.0.0',
		title: 'Video Docs Terminal',
		description:
			'Generate terminal demo videos from CLI walkthroughs with narration',
		domain: 'video',
		owners: ['@examples'],
		tags: ['video', 'terminal', 'docs', 'tutorial'],
		stability: 'experimental',
	},

	docs: [
		'docs.examples.video-docs-terminal',
		'docs.examples.video-docs-terminal.usage',
	],
});

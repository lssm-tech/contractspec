import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesVideoMarketingClipExample = defineExample({
	meta: {
		key: 'examples.video-marketing-clip',
		version: '1.0.0',
		title: 'Video Marketing Clip',
		description:
			'Generate short-form marketing videos from content briefs using the video-gen pipeline.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'video-marketing-clip'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.video-marketing-clip',
	},
});

export default ExamplesVideoMarketingClipExample;
export { ExamplesVideoMarketingClipExample };

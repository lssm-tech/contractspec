import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesVideoApiShowcaseExample = defineExample({
	meta: {
		key: 'examples.video-api-showcase',
		version: '1.0.0',
		title: 'Video Api Showcase',
		description:
			'Generate API documentation videos from contract spec definitions using the ApiOverview composition.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'video-api-showcase'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.video-api-showcase',
	},
});

export default ExamplesVideoApiShowcaseExample;
export { ExamplesVideoApiShowcaseExample };

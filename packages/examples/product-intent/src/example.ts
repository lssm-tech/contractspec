import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesProductIntentExample = defineExample({
	meta: {
		key: 'examples.product-intent',
		version: '1.0.0',
		title: 'Product Intent',
		description:
			'Product intent example: evidence ingestion and prompt-ready outputs.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'product-intent'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.product-intent',
	},
});

export default ExamplesProductIntentExample;
export { ExamplesProductIntentExample };

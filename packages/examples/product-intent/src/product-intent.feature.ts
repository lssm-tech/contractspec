import { defineFeature } from '@contractspec/lib.contracts-spec';

export const ProductIntentFeature = defineFeature({
	meta: {
		key: 'product-intent',
		version: '1.0.0',
		title: 'Product Intent',
		description:
			'Evidence ingestion, PostHog signals, and transcript-to-tickets discovery workflow',
		domain: 'product',
		owners: ['@examples'],
		tags: ['product', 'intent', 'evidence', 'posthog'],
		stability: 'experimental',
	},

	telemetry: [{ key: 'product-intent.telemetry', version: '1.0.0' }],

	docs: [],
});

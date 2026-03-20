import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const blocks: DocBlock[] = [
	{
		id: 'docs.examples.product-intent',
		title: 'Product Intent Discovery',
		summary:
			'Evidence-ingestion example for turning product signals into prompt-ready discovery outputs.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/examples/product-intent',
		tags: ['product-intent', 'discovery', 'evidence', 'example'],
		body: `## Included assets
- Product-intent feature and example manifest.
- Evidence loading helpers and PostHog signal ingestion.
- Sync actions and script entrypoints for discovery workflows.

## Use case
Use this example when you need a lightweight pattern for evidence-backed product discovery before it becomes a larger workflow or template.`,
	},
	{
		id: 'docs.examples.product-intent.usage',
		title: 'Product Intent Usage',
		summary: 'How to use the product-intent example for evidence ingestion.',
		kind: 'usage',
		visibility: 'public',
		route: '/docs/examples/product-intent/usage',
		tags: ['product-intent', 'usage'],
		body: `## Usage
1. Load evidence sources with the helpers in this package.
2. Transform product signals into the product-intent workflow inputs.
3. Export the resulting discovery outputs into the next planning step or agent prompt.`,
	},
];

registerDocBlocks(blocks);

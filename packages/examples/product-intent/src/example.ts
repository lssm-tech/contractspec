import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const example = defineExample({
  meta: {
    key: 'product-intent',
    version: '1.0.0',
    title: 'Product Intent Discovery',
    description:
      'Evidence ingestion and product-intent workflow for PM discovery.',
    kind: 'script',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['product-intent', 'discovery', 'pm', 'evidence', 'llm'],
  },
  docs: {
    rootDocId: 'docs.examples.product-intent',
    usageDocId: 'docs.examples.product-intent.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.product-intent',
    docs: './docs',
  },
  surfaces: {
    templates: false,
    sandbox: { enabled: false, modes: [] },
    studio: { enabled: false, installable: false },
    mcp: { enabled: false },
  },
});

export default example;

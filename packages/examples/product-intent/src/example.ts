import { defineExample } from '@contractspec/lib.contracts/examples';

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
  entrypoints: {
    packageName: '@contractspec/example.product-intent',
  },
  surfaces: {
    templates: false,
    sandbox: { enabled: false, modes: [] },
    studio: { enabled: false, installable: false },
    mcp: { enabled: false },
  },
});

export default example;

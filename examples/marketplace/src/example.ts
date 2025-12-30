import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'marketplace',
    version: '1.0.0',
    title: 'Marketplace (2-sided)',
    description:
      'Two-sided marketplace with stores, products, orders, payouts, and reviews (multi-actor flows).',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['marketplace', 'orders', 'payouts', 'reviews'],
  },
  docs: {
    rootDocId: 'docs.examples.marketplace',
    goalDocId: 'docs.examples.marketplace.goal',
    usageDocId: 'docs.examples.marketplace.usage',
    constraintsDocId: 'docs.examples.marketplace.constraints',
  },
  entrypoints: {
    packageName: '@contractspec/example.marketplace',
    feature: './feature',
    contracts: './contracts',
    presentations: './presentations',
    handlers: './handlers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: {
      enabled: true,
      modes: ['playground', 'specs', 'builder', 'markdown', 'evolution'],
    },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;

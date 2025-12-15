const example = {
  id: 'marketplace',
  title: 'Marketplace (2-sided)',
  summary:
    'Two-sided marketplace with stores, products, orders, payouts, and reviews (multi-actor flows).',
  tags: ['marketplace', 'orders', 'payouts', 'reviews'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.marketplace',
    goalDocId: 'docs.examples.marketplace.goal',
    usageDocId: 'docs.examples.marketplace.usage',
    constraintsDocId: 'docs.examples.marketplace.constraints',
  },
  entrypoints: {
    packageName: '@lssm/example.marketplace',
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
} as const;

export default example;

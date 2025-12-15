const example = {
  id: 'wealth-snapshot',
  title: 'Wealth Snapshot',
  summary:
    'Simple wealth overview with accounts, assets, liabilities, goals, and net-worth snapshots.',
  tags: ['finance', 'net-worth', 'goals'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.wealth-snapshot',
    goalDocId: 'docs.examples.wealth-snapshot.goal',
    usageDocId: 'docs.examples.wealth-snapshot.usage',
    constraintsDocId: 'docs.examples.wealth-snapshot.constraints',
  },
  entrypoints: {
    packageName: '@lssm/example.wealth-snapshot',
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

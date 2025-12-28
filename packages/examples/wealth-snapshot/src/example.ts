import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'wealth-snapshot',
    version: '1.0.0',
    title: 'Wealth Snapshot',
    description:
      'Simple wealth overview with accounts, assets, liabilities, goals, and net-worth snapshots.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['finance', 'net-worth', 'goals'],
  },
  docs: {
    rootDocId: 'docs.examples.wealth-snapshot',
    goalDocId: 'docs.examples.wealth-snapshot.goal',
    usageDocId: 'docs.examples.wealth-snapshot.usage',
    constraintsDocId: 'docs.examples.wealth-snapshot.constraints',
  },
  entrypoints: {
    packageName: '@contractspec/example.wealth-snapshot',
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

import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'versioned-knowledge-base',
    version: 1,
    title: 'Versioned Knowledge Base',
    description:
      'Curated KB with immutable sources, reviewable rule versions, and published snapshots.',
    kind: 'knowledge',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['knowledge', 'versioning', 'snapshots'],
  },
  docs: {
    rootDocId: 'docs.examples.versioned-knowledge-base',
  },
  entrypoints: {
    packageName: '@contractspec/example.versioned-knowledge-base',
    feature: './feature',
    contracts: './contracts',
    handlers: './handlers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs', 'builder'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;

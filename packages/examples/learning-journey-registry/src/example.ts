import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'learning-journey-registry',
    version: 1,
    title: 'Learning Journey Registry',
    description:
      'Registry of learning journey tracks + presentations + UI mini-app bindings.',
    kind: 'library',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'journey', 'registry'],
  },
  docs: {
    rootDocId: 'docs.examples.learning-journey-registry',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-registry',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;

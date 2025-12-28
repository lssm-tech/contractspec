import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'learning-journey-ui-shared',
    version: '1.0.0',
    title: 'Learning Journey UI — Shared',
    description:
      'Shared UI components and hooks for learning journey mini-apps.',
    kind: 'ui',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'ui', 'shared'],
  },
  docs: {
    rootDocId: 'docs.examples.learning-journey-ui-shared',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-ui-shared',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground', 'markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;

import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'learning-journey-ui-gamified',
    version: '1.0.0',
    title: 'Learning Journey UI — Gamified',
    description:
      'UI mini-app for gamified learning: flashcards, mastery ring, calendar.',
    kind: 'ui',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'ui', 'gamified'],
  },
  docs: {
    rootDocId: 'docs.examples.learning-journey-ui-gamified',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-ui-gamified',
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

import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'learning-journey-duo-drills',
    version: '1.0.0',
    title: 'Learning Journey — Duo Drills',
    description:
      'Short drill/SRS example with XP and streak hooks for language, finance, or ContractSpec concept drills.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'drills', 'srs', 'xp'],
  },
  docs: {
    rootDocId: 'docs.learning-journey.duo-drills',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-duo-drills',
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

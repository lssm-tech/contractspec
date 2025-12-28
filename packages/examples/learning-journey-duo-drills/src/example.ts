const example = {
  id: 'learning-journey-duo-drills',
  title: 'Learning Journey — Duo Drills',
  summary:
    'Short drill/SRS example with XP and streak hooks for language, finance, or ContractSpec concept drills.',
  tags: ['learning', 'drills', 'srs', 'xp'],
  kind: 'template',
  visibility: 'public',
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
} as const;

export default example;

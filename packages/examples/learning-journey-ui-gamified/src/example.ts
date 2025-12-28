const example = {
  id: 'learning-journey-ui-gamified',
  title: 'Learning Journey UI — Gamified',
  summary:
    'UI mini-app for gamified learning: flashcards, mastery ring, calendar.',
  tags: ['learning', 'ui', 'gamified'],
  kind: 'ui',
  visibility: 'public',
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
} as const;

export default example;

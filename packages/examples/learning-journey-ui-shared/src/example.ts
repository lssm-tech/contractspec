const example = {
  id: 'learning-journey-ui-shared',
  title: 'Learning Journey UI — Shared',
  summary: 'Shared UI components and hooks for learning journey mini-apps.',
  tags: ['learning', 'ui', 'shared'],
  kind: 'ui',
  visibility: 'public',
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
} as const;

export default example;

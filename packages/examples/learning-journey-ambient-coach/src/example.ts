const example = {
  id: 'learning-journey-ambient-coach',
  title: 'Learning Journey — Ambient Coach',
  summary:
    'Ambient coaching pattern: lightweight nudges driven by context and recent progress.',
  tags: ['learning', 'coaching', 'ambient'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.learning-journey.ambient-coach',
  },
  entrypoints: {
    packageName: '@lssm/example.learning-journey-ambient-coach',
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

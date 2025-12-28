const example = {
  id: 'learning-patterns',
  title: 'Learning Patterns',
  summary:
    'Domain-agnostic learning archetypes implemented as Learning Journey tracks.',
  tags: ['learning', 'journey', 'patterns'],
  kind: 'library',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.learning-patterns',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-patterns',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
} as const;

export default example;

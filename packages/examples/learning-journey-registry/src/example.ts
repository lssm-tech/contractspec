const example = {
  id: 'learning-journey-registry',
  title: 'Learning Journey Registry',
  summary:
    'Registry of learning journey tracks + presentations + UI mini-app bindings.',
  tags: ['learning', 'journey', 'registry'],
  kind: 'library',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.learning-journey-registry',
  },
  entrypoints: {
    packageName: '@lssm/example.learning-journey-registry',
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

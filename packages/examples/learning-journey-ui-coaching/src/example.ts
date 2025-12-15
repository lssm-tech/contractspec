const example = {
  id: 'learning-journey-ui-coaching',
  title: 'Learning Journey UI — Coaching',
  summary:
    'UI mini-app for coaching patterns: tips, engagement meter, progress.',
  tags: ['learning', 'ui', 'coaching'],
  kind: 'ui',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.learning-journey-ui-coaching',
  },
  entrypoints: {
    packageName: '@lssm/example.learning-journey-ui-coaching',
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

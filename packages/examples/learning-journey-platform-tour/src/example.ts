const example = {
  id: 'learning-journey-platform-tour',
  title: 'Learning Journey — Platform Tour',
  summary:
    'Learning journey track + contracts + presentations for a platform tour.',
  tags: ['learning', 'journey', 'platform-tour'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.platform-tour',
    goalDocId: 'docs.examples.platform-tour.goal',
    usageDocId: 'docs.examples.platform-tour.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-platform-tour',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'playground'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
} as const;

export default example;

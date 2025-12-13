const example = {
  id: 'learning-journey-ui-onboarding',
  title: 'Learning Journey UI — Onboarding',
  summary: 'UI mini-app for onboarding patterns: checklists, code snippets, journey map.',
  tags: ['learning', 'ui', 'onboarding'],
  kind: 'ui',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.learning-journey-ui-onboarding',
  },
  entrypoints: {
    packageName: '@lssm/example.learning-journey-ui-onboarding',
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



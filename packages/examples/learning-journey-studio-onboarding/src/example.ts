const example = {
  id: 'learning-journey-studio-onboarding',
  title: 'Learning Journey — Studio Getting Started',
  summary:
    'Onboarding track guiding a new Studio user through template spawn, spec edit, regeneration, playground, and evolution.',
  tags: ['learning', 'onboarding', 'studio'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.learning-journey.studio-onboarding',
  },
  entrypoints: {
    packageName: '@lssm/example.learning-journey-studio-onboarding',
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

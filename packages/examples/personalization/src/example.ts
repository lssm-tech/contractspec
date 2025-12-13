const example = {
  id: 'personalization',
  title: 'Personalization Patterns',
  summary:
    'Small examples for behavior tracking, overlay-based UI customization, and tenant workflow extension.',
  tags: ['personalization', 'overlays', 'behavior', 'workflows'],
  kind: 'library',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.personalization',
    usageDocId: 'docs.examples.personalization.usage',
  },
  entrypoints: {
    packageName: '@lssm/example.personalization',
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



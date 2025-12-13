const example = {
  id: 'learning-journey-crm-onboarding',
  title: 'Learning Journey — CRM First Win',
  summary:
    'Onboarding track for CRM Pipeline driving users from empty CRM to first closed-won deal.',
  tags: ['learning', 'crm', 'onboarding'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.learning-journey.crm-onboarding',
  },
  entrypoints: {
    packageName: '@lssm/example.learning-journey-crm-onboarding',
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



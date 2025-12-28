import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'learning-journey-crm-onboarding',
    version: '1.0.0',
    title: 'Learning Journey — CRM First Win',
    description:
      'Onboarding track for CRM Pipeline driving users from empty CRM to first closed-won deal.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'crm', 'onboarding'],
  },
  docs: {
    rootDocId: 'docs.learning-journey.crm-onboarding',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-crm-onboarding',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground', 'markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;

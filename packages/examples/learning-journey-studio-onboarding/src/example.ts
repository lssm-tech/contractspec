import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'learning-journey-studio-onboarding',
    version: '1.0.0',
    title: 'Learning Journey — Studio Getting Started',
    description:
      'Onboarding track guiding a new Studio user through template spawn, spec edit, regeneration, playground, and evolution.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'onboarding', 'studio'],
  },
  docs: {
    rootDocId: 'docs.learning-journey.studio-onboarding',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-studio-onboarding',
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

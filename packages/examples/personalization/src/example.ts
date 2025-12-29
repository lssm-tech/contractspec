import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'personalization',
    version: '1.0.0',
    title: 'Personalization Patterns',
    description:
      'Small examples for behavior tracking, overlay-based UI customization, and tenant workflow extension.',
    kind: 'library',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['personalization', 'overlays', 'behavior', 'workflows'],
  },
  docs: {
    rootDocId: 'docs.examples.personalization',
    usageDocId: 'docs.examples.personalization.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.personalization',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;

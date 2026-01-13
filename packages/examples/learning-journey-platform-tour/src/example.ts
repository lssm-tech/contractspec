import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'learning-journey-platform-tour',
    version: '1.0.0',
    title: 'Learning Journey — Platform Tour',
    description:
      'Learning journey track + contracts + presentations for a platform tour.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'journey', 'platform-tour'],
  },
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
});

export default example;

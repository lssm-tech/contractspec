import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'video-api-showcase',
    version: '1.0.0',
    title: 'Video API Showcase',
    description:
      'Generate API documentation videos from contract spec definitions using the ApiOverview composition.',
    kind: 'script',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['video', 'api', 'documentation', 'spec-driven'],
  },
  docs: {
    rootDocId: 'docs.examples.video-api-showcase',
    usageDocId: 'docs.examples.video-api-showcase.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.video-api-showcase',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;

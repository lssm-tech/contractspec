import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'integration-hub',
    version: '1.0.0',
    title: 'Integration Hub',
    description:
      'Provider-agnostic integration center with connectors, connections, field mappings, and sync logs.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['integrations', 'sync', 'etl', 'connectors'],
  },
  docs: {
    rootDocId: 'docs.examples.integration-hub',
    goalDocId: 'docs.examples.integration-hub.goal',
    usageDocId: 'docs.examples.integration-hub.usage',
    constraintsDocId: 'docs.examples.integration-hub.constraints',
  },
  entrypoints: {
    packageName: '@contractspec/example.integration-hub',
    feature: './feature',
    contracts: './contracts',
    presentations: './presentations',
    handlers: './handlers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: {
      enabled: true,
      modes: ['playground', 'specs', 'builder', 'markdown', 'evolution'],
    },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;

const example = {
  id: 'integration-hub',
  title: 'Integration Hub',
  summary:
    'Provider-agnostic integration center with connectors, connections, field mappings, and sync logs.',
  tags: ['integrations', 'sync', 'etl', 'connectors'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.integration-hub',
    goalDocId: 'docs.examples.integration-hub.goal',
    usageDocId: 'docs.examples.integration-hub.usage',
    constraintsDocId: 'docs.examples.integration-hub.constraints',
  },
  entrypoints: {
    packageName: '@lssm/example.integration-hub',
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
} as const;

export default example;

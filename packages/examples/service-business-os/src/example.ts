const example = {
  id: 'service-business-os',
  title: 'Service Business OS',
  summary:
    'Service business operating system: jobs, clients, scheduling, invoicing, and ops dashboards.',
  tags: ['service-business', 'jobs', 'scheduling', 'invoicing'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.service-business-os',
  },
  entrypoints: {
    packageName: '@lssm/example.service-business-os',
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

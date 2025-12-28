const example = {
  id: 'crm-pipeline',
  title: 'CRM Pipeline',
  summary: 'Sales CRM with contacts, companies, deals, pipelines, and tasks.',
  tags: ['crm', 'sales', 'pipeline', 'deals'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.crm-pipeline',
  },
  entrypoints: {
    packageName: '@contractspec/example.crm-pipeline',
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

import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'crm-pipeline',
    version: 1,
    title: 'CRM Pipeline',
    description:
      'Sales CRM with contacts, companies, deals, pipelines, and tasks.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['crm', 'sales', 'pipeline', 'deals'],
  },
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
};

export default example;

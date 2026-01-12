import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'service-business-os',
    version: '1.0.0',
    title: 'Service Business OS',
    description:
      'Service business operating system: jobs, clients, scheduling, invoicing, and ops dashboards.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['service-business', 'jobs', 'scheduling', 'invoicing'],
  },
  docs: {
    rootDocId: 'docs.examples.service-business-os',
  },
  entrypoints: {
    packageName: '@contractspec/example.service-business-os',
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

import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'saas-boilerplate',
    version: '1.0.0',
    title: 'SaaS Boilerplate',
    description:
      'Multi-tenant SaaS foundation with orgs, projects, settings, billing usage, and RBAC.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['saas', 'multi-tenant', 'billing', 'rbac'],
  },
  docs: {
    rootDocId: 'docs.examples.saas-boilerplate',
  },
  entrypoints: {
    packageName: '@contractspec/example.saas-boilerplate',
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

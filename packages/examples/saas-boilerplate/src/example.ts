const example = {
  id: 'saas-boilerplate',
  title: 'SaaS Boilerplate',
  summary:
    'Multi-tenant SaaS foundation with orgs, projects, settings, billing usage, and RBAC.',
  tags: ['saas', 'multi-tenant', 'billing', 'rbac'],
  kind: 'template',
  visibility: 'public',
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
} as const;

export default example;

const example = {
  id: 'analytics-dashboard',
  title: 'Analytics Dashboard',
  summary:
    'Tenant-scoped dashboards, widgets, query builder, and scheduled reports (spec-first widgets/queries).',
  tags: ['analytics', 'dashboards', 'bi', 'queries'],
  kind: 'template',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.analytics-dashboard',
    goalDocId: 'docs.examples.analytics-dashboard.goal',
    usageDocId: 'docs.examples.analytics-dashboard.usage',
    constraintsDocId: 'docs.examples.analytics-dashboard.constraints',
  },
  entrypoints: {
    packageName: '@lssm/example.analytics-dashboard',
    feature: './feature',
    contracts: './contracts',
    presentations: './presentations',
    handlers: './handlers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground', 'specs', 'builder', 'markdown', 'evolution'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
} as const;

export default example;



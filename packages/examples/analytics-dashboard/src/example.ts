import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'analytics-dashboard',
    version: 1,
    title: 'Analytics Dashboard',
    description:
      'Tenant-scoped dashboards, widgets, query builder, and scheduled reports (spec-first widgets/queries).',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['analytics', 'dashboards', 'bi', 'queries'],
  },
  docs: {
    rootDocId: 'docs.examples.analytics-dashboard',
    goalDocId: 'docs.examples.analytics-dashboard.goal',
    usageDocId: 'docs.examples.analytics-dashboard.usage',
    constraintsDocId: 'docs.examples.analytics-dashboard.constraints',
  },
  entrypoints: {
    packageName: '@contractspec/example.analytics-dashboard',
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

import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'lifecycle-dashboard',
    version: '1.0.0',
    title: 'Lifecycle Dashboard (snippet)',
    description:
      'A minimal dashboard page pattern: call lifecycle-managed endpoints and render a mobile-friendly status card.',
    kind: 'blueprint',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['lifecycle', 'dashboard', 'nextjs', 'snippet'],
  },
  docs: {
    rootDocId: 'docs.examples.lifecycle-dashboard',
  },
  entrypoints: {
    packageName: '@contractspec/example.lifecycle-dashboard',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;

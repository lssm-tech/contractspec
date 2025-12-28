const example = {
  id: 'lifecycle-dashboard',
  title: 'Lifecycle Dashboard (snippet)',
  summary:
    'A minimal dashboard page pattern: call lifecycle-managed endpoints and render a mobile-friendly status card.',
  tags: ['lifecycle', 'dashboard', 'nextjs', 'snippet'],
  kind: 'blueprint',
  visibility: 'public',
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
} as const;

export default example;

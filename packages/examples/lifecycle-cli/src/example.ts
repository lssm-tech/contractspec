const example = {
  id: 'lifecycle-cli',
  title: 'Lifecycle CLI',
  summary:
    'Tiny script showing how to run the lifecycle managed service from a CLI (no HTTP server required).',
  tags: ['lifecycle', 'cli', 'demo'],
  kind: 'script',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.lifecycle-cli',
    usageDocId: 'docs.examples.lifecycle-cli.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.lifecycle-cli',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
} as const;

export default example;

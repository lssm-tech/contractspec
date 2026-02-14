import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'lifecycle-cli',
    version: '1.0.0',
    title: 'Lifecycle CLI',
    description:
      'Tiny script showing how to run the lifecycle managed service from a CLI (no HTTP server required).',
    kind: 'script',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['lifecycle', 'cli', 'demo'],
  },
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
});

export default example;

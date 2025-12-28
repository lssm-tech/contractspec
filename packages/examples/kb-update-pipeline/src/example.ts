import type { ExampleSpec } from '@contractspec/lib.contracts';

const example: ExampleSpec = {
  meta: {
    key: 'kb-update-pipeline',
    version: 1,
    title: 'KB Update Pipeline',
    description:
      'Automation proposes KB updates; humans verify; everything audited and notified.',
    kind: 'knowledge',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['knowledge', 'pipeline', 'hitl', 'audit'],
  },
  docs: {
    rootDocId: 'docs.examples.kb-update-pipeline',
  },
  entrypoints: {
    packageName: '@contractspec/example.kb-update-pipeline',
    feature: './feature',
    contracts: './contracts',
    handlers: './handlers',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown', 'specs', 'builder'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};

export default example;

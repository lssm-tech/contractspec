import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'kb-update-pipeline',
    version: '1.0.0',
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
});

export default example;

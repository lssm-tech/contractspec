const example = {
  id: 'kb-update-pipeline',
  title: 'KB Update Pipeline',
  summary:
    'Automation proposes KB updates; humans verify; everything audited and notified.',
  tags: ['knowledge', 'pipeline', 'hitl', 'audit'],
  kind: 'knowledge',
  visibility: 'public',
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
} as const;

export default example;

const example = {
  id: 'knowledge-canon',
  title: 'Knowledge Canon (Product Canon space)',
  summary:
    'Bind a canonical knowledge space to a tenant and route assistant/workflow requests to the right sources (blueprint + app config pattern).',
  tags: ['knowledge', 'canon', 'app-config', 'agents', 'workflows'],
  kind: 'knowledge',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.knowledge-canon',
    usageDocId: 'docs.examples.knowledge-canon.usage',
  },
  entrypoints: {
    packageName: '@lssm/example.knowledge-canon',
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



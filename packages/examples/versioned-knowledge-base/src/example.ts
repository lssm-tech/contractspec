const example = {
  id: 'versioned-knowledge-base',
  title: 'Versioned Knowledge Base',
  summary:
    'Curated KB with immutable sources, reviewable rule versions, and published snapshots.',
  tags: ['knowledge', 'versioning', 'snapshots'],
  kind: 'knowledge',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.versioned-knowledge-base',
  },
  entrypoints: {
    packageName: '@lssm/example.versioned-knowledge-base',
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



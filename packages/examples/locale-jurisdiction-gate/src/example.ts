const example = {
  id: 'locale-jurisdiction-gate',
  title: 'Locale / Jurisdiction Gate',
  summary:
    'Fail-closed gating for assistant calls: locale + jurisdiction + kbSnapshotId + allowedScope must be explicit, answers must cite a snapshot.',
  tags: ['policy', 'locale', 'jurisdiction', 'assistant', 'gating'],
  kind: 'knowledge',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.locale-jurisdiction-gate',
  },
  entrypoints: {
    packageName: '@lssm/example.locale-jurisdiction-gate',
    feature: './feature',
    contracts: './contracts',
    handlers: './handlers',
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



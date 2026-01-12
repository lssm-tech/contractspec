import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'locale-jurisdiction-gate',
    version: '1.0.0',
    title: 'Locale / Jurisdiction Gate',
    description:
      'Fail-closed gating for assistant calls: locale + jurisdiction + kbSnapshotId + allowedScope must be explicit, answers must cite a snapshot.',
    kind: 'knowledge',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['policy', 'locale', 'jurisdiction', 'assistant', 'gating'],
  },
  docs: {
    rootDocId: 'docs.examples.locale-jurisdiction-gate',
  },
  entrypoints: {
    packageName: '@contractspec/example.locale-jurisdiction-gate',
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
});

export default example;

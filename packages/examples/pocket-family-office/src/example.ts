import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'pocket-family-office',
    version: '1.0.0',
    title: 'Pocket Family Office',
    description:
      'Personal finance automation with document ingestion, open banking, and AI summaries',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.finance'],
    tags: [
      'finance',
      'open-banking',
      'documents',
      'automation',
      'family-office',
    ],
  },
  docs: {
    rootDocId: 'docs.examples.pocket-family-office',
  },
  entrypoints: {
    packageName: '@contractspec/example.pocket-family-office',
    feature: './feature',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: {
      enabled: true,
      modes: ['playground', 'specs', 'builder'],
    },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;

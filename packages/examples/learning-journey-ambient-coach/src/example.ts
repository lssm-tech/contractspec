import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'learning-journey-ambient-coach',
    version: '1.0.0',
    title: 'Learning Journey — Ambient Coach',
    description:
      'Ambient coaching pattern: lightweight nudges driven by context and recent progress.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'coaching', 'ambient'],
  },
  docs: {
    rootDocId: 'docs.learning-journey.ambient-coach',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-ambient-coach',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground', 'markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;

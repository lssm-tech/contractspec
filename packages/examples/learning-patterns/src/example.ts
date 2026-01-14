import { defineExample } from '@contractspec/lib.contracts';

const example = defineExample({
  meta: {
    key: 'learning-patterns',
    version: '1.0.0',
    title: 'Learning Patterns',
    description:
      'Domain-agnostic learning archetypes implemented as Learning Journey tracks.',
    kind: 'library',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'journey', 'patterns'],
  },
  docs: {
    rootDocId: 'docs.examples.learning-patterns',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-patterns',
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

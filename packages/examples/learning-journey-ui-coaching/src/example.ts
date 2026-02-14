import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'learning-journey-ui-coaching',
    version: '1.0.0',
    title: 'Learning Journey UI — Coaching',
    description:
      'UI mini-app for coaching patterns: tips, engagement meter, progress.',
    kind: 'ui',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'ui', 'coaching'],
  },
  docs: {
    rootDocId: 'docs.examples.learning-journey-ui-coaching',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-ui-coaching',
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

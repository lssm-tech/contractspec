import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'learning-journey-ui-onboarding',
    version: '1.0.0',
    title: 'Learning Journey UI — Onboarding',
    description:
      'UI mini-app for onboarding patterns: checklists, code snippets, journey map.',
    kind: 'ui',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'ui', 'onboarding'],
  },
  docs: {
    rootDocId: 'docs.examples.learning-journey-ui-onboarding',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-ui-onboarding',
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

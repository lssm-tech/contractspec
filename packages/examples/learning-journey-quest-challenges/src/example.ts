import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'learning-journey-quest-challenges',
    version: '1.0.0',
    title: 'Learning Journey — Quest Challenges',
    description:
      'Quest/challenge pattern: multi-step goals with progress events, rewards, and streak hooks.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['learning', 'quests', 'challenges'],
  },
  docs: {
    rootDocId: 'docs.learning-journey.quest-challenges',
  },
  entrypoints: {
    packageName: '@contractspec/example.learning-journey-quest-challenges',
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

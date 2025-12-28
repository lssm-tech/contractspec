const example = {
  id: 'learning-journey-quest-challenges',
  title: 'Learning Journey — Quest Challenges',
  summary:
    'Quest/challenge pattern: multi-step goals with progress events, rewards, and streak hooks.',
  tags: ['learning', 'quests', 'challenges'],
  kind: 'template',
  visibility: 'public',
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
} as const;

export default example;

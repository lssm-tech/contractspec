const example = {
  id: 'ai-support-bot',
  title: 'AI Support Bot',
  summary:
    'Classify and resolve a support ticket (with a drafted response) using the support-bot and knowledge libraries.',
  tags: ['support', 'ai', 'tickets', 'knowledge'],
  kind: 'script',
  visibility: 'public',
  docs: {
    rootDocId: 'docs.examples.ai-support-bot',
    usageDocId: 'docs.examples.ai-support-bot.usage',
  },
  entrypoints: {
    packageName: '@lssm/example.ai-support-bot',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
} as const;

export default example;



import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
  meta: {
    key: 'ai-support-bot',
    version: '1.0.0',
    title: 'AI Support Bot',
    description:
      'Classify and resolve a support ticket (with a drafted response) using the support-bot and knowledge libraries.',
    kind: 'script',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['support', 'ai', 'tickets', 'knowledge'],
  },
  docs: {
    rootDocId: 'docs.examples.ai-support-bot',
    usageDocId: 'docs.examples.ai-support-bot.usage',
  },
  entrypoints: {
    packageName: '@contractspec/example.ai-support-bot',
    docs: './docs',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['markdown'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
});

export default example;

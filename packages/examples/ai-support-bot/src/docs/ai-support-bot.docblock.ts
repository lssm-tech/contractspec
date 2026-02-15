import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.ai-support-bot',
    title: 'AI Support Bot (example)',
    summary:
      'Ticket classification + knowledge-grounded resolution + response drafting.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/ai-support-bot',
    tags: ['support', 'ai', 'example'],
    body: `## What this example shows\n- Classify a ticket into a support category.\n- Use a knowledge port to generate a grounded resolution.\n- Draft a response (email body) from the resolution.\n\n## Guardrails\n- Avoid logging raw ticket bodies/PII; prefer structured summaries.\n- Keep knowledge and ticket adapters explicit and testable.`,
  },
  {
    id: 'docs.examples.ai-support-bot.usage',
    title: 'AI Support Bot — Usage',
    summary: 'How to run the example and swap the knowledge adapter.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/ai-support-bot/usage',
    tags: ['support', 'usage'],
    body: `## Usage\n- Call \`runAiSupportBotExample()\`.\n- Replace the \`knowledge.query\` implementation with a real knowledge service.\n\n## Notes\n- Keep outputs structured.\n- Use policy gates before exposing drafted replies to end-users.`,
  },
];

registerDocBlocks(blocks);

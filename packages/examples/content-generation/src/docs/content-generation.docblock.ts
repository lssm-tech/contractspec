import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.content-generation',
    title: 'Content Generation (example)',
    summary:
      'Generate a consistent set of marketing assets from a typed ContentBrief (blog, landing hero, email, social, SEO).',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/content-generation',
    tags: ['content', 'marketing', 'example'],
    body: `## What this example shows\n- A spec-first-ish interface for content brief inputs (typed, validated).\n- Deterministic orchestration of generators (same input → same structure).\n\n## Outputs\n- Blog intro\n- Landing hero\n- Email subject/body\n- Social post bodies\n- SEO metadata`,
  },
  {
    id: 'docs.examples.content-generation.usage',
    title: 'Content Generation — Usage',
    summary: 'How to run the example and extend the brief.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/content-generation/usage',
    tags: ['content', 'usage'],
    body: `## Usage\n- Call \`runContentGenerationExample()\`.\n- Modify the \`ContentBrief\` fields to drive different outputs.\n\n## Guardrails\n- Avoid PII in briefs.\n- Keep output logging structured; no raw \`console.log\` in library code.`,
  },
];

registerDocBlocks(blocks);

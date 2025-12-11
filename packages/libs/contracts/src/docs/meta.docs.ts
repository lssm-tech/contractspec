import type { DocBlock } from './types';

export const metaDocs: DocBlock[] = [
  {
    id: 'docs.meta.docblocks-process',
    title: 'DocBlocks process',
    summary: 'How to author goal/how/usage DocBlocks close to code.',
    kind: 'reference',
    visibility: 'mixed',
    route: '/docs/meta/docblocks-process',
    tags: ['docs', 'process'],
    body: `## DocBlocks authoring rules

- Colocate docs beside implementation; avoid barrel /docs folders.
- Split intent:
  - **goal**: why this exists (before implementation).
  - **how**: operational/runbook steps.
  - **usage**: quick checklist for consumers.
- Use \`visibility\`: public | internal | mixed.
- Prefer routes like \`/docs/<domain>/<topic>/<kind>\`; ids mirror that.
- Keep body Markdown LLM-friendly; avoid HTML.
- Add owners/tags/domain/stability when known.
- For presentations/markdown outputs, rely on TransformEngine via DocRegistry.
- No sourcePath; DocBlocks are canonical.`,
  },
];


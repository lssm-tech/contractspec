import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const docBlocks: DocBlock[] = [
  {
    id: 'docs.examples.learning-patterns.goal',
    title: 'Learning Patterns — Goal',
    summary: 'Domain-agnostic drills, ambient coaching, and quests built on Learning Journey.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/learning-patterns/goal',
    tags: ['learning', 'drills', 'quests', 'coaching'],
    body: `## Why it matters
- Demonstrates multiple learning archetypes without vertical coupling.\n- Progress is event-driven (no client-side hacks).\n- SRS logic is deterministic and testable.`,
  },
  {
    id: 'docs.examples.learning-patterns.reference',
    title: 'Learning Patterns — Reference',
    summary: 'Track specs and event names exported by the learning patterns example.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/learning-patterns',
    tags: ['learning', 'reference'],
    body: `## Tracks\n- Drills + SRS\n- Ambient Coach\n- Quests\n\n## Events\n- drill.*\n- coach.*\n- quest.*`,
  },
];

registerDocBlocks(docBlocks);



import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.learning-journey-ui-gamified',
    title: 'Learning Journey UI — Gamified',
    summary:
      'UI mini-app components for gamified learning: flashcards, mastery, streak/calendar.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/learning-journey-ui-gamified',
    tags: ['learning', 'ui', 'gamified'],
    body: `## Includes\n- Gamified mini-app shell\n- Views: overview, steps, progress, timeline\n- Components: flash card, mastery ring, day calendar\n\n## Notes\n- Compose with design system components.\n- Respect prefers-reduced-motion; keep tap targets large.`,
  },
];

registerDocBlocks(blocks);



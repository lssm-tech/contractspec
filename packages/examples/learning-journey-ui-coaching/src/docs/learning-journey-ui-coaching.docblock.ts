import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.learning-journey-ui-coaching',
    title: 'Learning Journey UI — Coaching',
    summary: 'UI mini-app components for coaching: tips, engagement, progress.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/learning-journey-ui-coaching',
    tags: ['learning', 'ui', 'coaching'],
    body: `## Includes\n- Coaching mini-app shell\n- Views: overview, steps, progress, timeline\n- Components: tip card, engagement meter, tip feed\n\n## Notes\n- Compose using design system components.\n- Keep accessibility and mobile-friendly tap targets.`,
  },
];

registerDocBlocks(blocks);



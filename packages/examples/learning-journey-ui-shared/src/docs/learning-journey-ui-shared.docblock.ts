import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.learning-journey-ui-shared',
    title: 'Learning Journey UI — Shared',
    summary: 'Shared UI components and hooks for learning journey mini-apps.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/learning-journey-ui-shared',
    tags: ['learning', 'ui', 'shared'],
    body: `## Includes\n- Hooks: useLearningProgress\n- Components: XpBar, StreakCounter, BadgeDisplay, ViewTabs\n\n## Notes\n- Keep components accessible (labels, focus, contrast).\n- Prefer design-system tokens and components.`,
  },
];

registerDocBlocks(blocks);



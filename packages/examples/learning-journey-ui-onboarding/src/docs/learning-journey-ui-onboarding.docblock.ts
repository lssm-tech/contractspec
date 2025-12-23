import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.learning-journey-ui-onboarding',
    title: 'Learning Journey UI — Onboarding',
    summary:
      'UI mini-app components for onboarding: checklists, snippets, and journey mapping.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/learning-journey-ui-onboarding',
    tags: ['learning', 'ui', 'onboarding'],
    body: `## Includes\n- Onboarding mini-app shell\n- Views: overview, steps, progress, timeline\n- Components: step checklist, code snippet, journey map\n\n## Notes\n- Compose with design system components.\n- Ensure accessible labels and keyboard navigation.`,
  },
];

registerDocBlocks(blocks);

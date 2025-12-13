import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const blocks: DocBlock[] = [
  {
    id: 'docs.examples.lifecycle-dashboard',
    title: 'Lifecycle Dashboard (example snippet)',
    summary:
      'Minimal dashboard page pattern that calls lifecycle-managed API routes and renders a status card.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/lifecycle-dashboard',
    tags: ['lifecycle', 'dashboard', 'example'],
    body: `## What this example shows\n- A simple client-driven fetch to \`POST /api/lifecycle/assessments\`.\n- A card-shaped UI pattern for stage + confidence + recommendations.\n\n## Notes\n- Keep your app design-system-first (no raw HTML in application code).\n- Add explicit loading/error/empty states with accessible messaging.\n- Implement API routes in your app as thin adapters over lifecycle-managed services.`,
  },
];

registerDocBlocks(blocks);

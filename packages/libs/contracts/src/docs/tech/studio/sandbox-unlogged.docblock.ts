import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_studio_sandbox_unlogged_DocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.studio.sandbox.unlogged',
    title: 'Sandbox (unlogged) vs Studio (authenticated)',
    summary:
      'The sandbox is a lightweight, unlogged surface that mirrors Studio navigation without auth or analytics.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/studio/sandbox-unlogged',
    tags: ['studio', 'sandbox', 'privacy', 'analytics'],
    body: `## Sandbox guarantees

- Route: \`/sandbox\`
- **No auth requirement**
- **No PostHog init**
- **No Vercel Analytics**
- Local-only state (in-browser runtime + localStorage where needed)

## What Sandbox is for

- Try templates and feature modules safely
- Preview specs/builder/evolution/learning
- Produce copyable CLI commands (no side effects)

## What Sandbox is *not* for

- Persisted projects/workspaces
- Real deployments
- Organization-scoped integrations (unless explicitly enabled later)
`,
  },
];

registerDocBlocks(tech_studio_sandbox_unlogged_DocBlocks);

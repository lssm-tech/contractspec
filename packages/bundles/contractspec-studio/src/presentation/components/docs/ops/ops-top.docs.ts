import type { DocBlock } from '@lssm/lib.contracts/docs';

export const opsTopDocs: DocBlock[] = [
  {
    id: 'docs.ops.index',
    title: 'Operations docs index',
    summary: 'Entry point for operations runbooks and guides.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/ops',
    tags: ['ops'],
    body: `# Operations

Browse runbooks and guides for ops workflows:
- Anomaly detection (goal/usage/how)
- Cost optimization (goal/usage/how)
- Lifecycle operations (goal/usage/how)
- Profile settings (goal/usage/how)
- Progressive delivery (goal/usage/how)
- SLO management (goal/usage/how)
- Tenant customization (goal/usage/how)`,
  },
];






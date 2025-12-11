import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const wealthSnapshotDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.wealth-snapshot',
    title: 'Wealth Snapshot',
    summary:
      'Simple wealth overview with accounts, assets, liabilities, goals, and net-worth snapshots.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/wealth-snapshot',
    tags: ['finance', 'net-worth', 'goals'],
    body: `## Features

- Accounts with balances/currencies.
- Assets & liabilities categorized for net worth.
- Goals with target amounts/dates and status.
- Net worth snapshots for charting; events emitted for analytics.

## Modules reused
- Identity/RBAC for scoping to household/org
- Notifications for threshold crossings/goal reminders
- Audit trail for financial changes

## Presentations
- Dashboard, accounts list, assets list, liabilities list, goals list (React + Markdown targets).
`,
  },
];

registerDocBlocks(wealthSnapshotDocBlocks);

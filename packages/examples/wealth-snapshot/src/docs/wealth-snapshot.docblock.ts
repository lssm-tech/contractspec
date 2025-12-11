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
  {
    id: 'docs.examples.wealth-snapshot.goal',
    title: 'Wealth Snapshot — Goal',
    summary: 'Why this personal/household finance template exists.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/wealth-snapshot/goal',
    tags: ['finance', 'goal'],
    body: `## Why it matters
- Provides a regenerable net-worth and goals view without bespoke finance code.
- Keeps accounts/assets/liabilities/goals consistent across surfaces with PII care.

## Business/Product goal
- Deliver clear net-worth visibility, goal tracking, and alerting for thresholds.
- Support safe regeneration while keeping currency/units explicit.

## Success criteria
- Spec changes to assets/liabilities/goals regenerate UI/API/events cleanly.
- PII and sensitive values are marked and redacted where needed.`,
  },
  {
    id: 'docs.examples.wealth-snapshot.usage',
    title: 'Wealth Snapshot — Usage',
    summary: 'How to seed, extend, and regenerate wealth tracking safely.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/wealth-snapshot/usage',
    tags: ['finance', 'usage'],
    body: `## Setup
1) Seed (if provided) or add accounts/assets/liabilities/goals via UI.
2) Configure Notifications for goal reminders/threshold alerts; Audit for changes.

## Extend & regenerate
1) Adjust schemas for asset classes, liability terms, goal metrics; keep currency/units explicit.
2) Regenerate to update dashboards and events; mark PII paths (account numbers, holder names).
3) Use Feature Flags to trial new indicators or alerting rules.

## Guardrails
- Emit events for asset/liability/goal changes; log in Audit Trail.
- Redact sensitive identifiers in presentations.
- Keep calculations (net worth) transparent and driven by spec fields.`,
  },
];

registerDocBlocks(wealthSnapshotDocBlocks);

import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const WealthSnapshotFeature: FeatureModuleSpec = {
  meta: {
    key: 'wealth-snapshot',
    version: 1,
    title: 'Wealth Snapshot',
    description:
      'Mini-app for accounts, assets, liabilities, goals, and net worth.',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'net-worth', 'goals'],
    stability: 'experimental',
  },
  operations: [
    { key: 'wealth.account.create', version: 1 },
    { key: 'wealth.asset.add', version: 1 },
    { key: 'wealth.liability.add', version: 1 },
    { key: 'wealth.goal.create', version: 1 },
    { key: 'wealth.goal.update', version: 1 },
    { key: 'wealth.networth.get', version: 1 },
  ],
  events: [
    { key: 'wealth.asset.added', version: 1 },
    { key: 'wealth.liability.added', version: 1 },
    { key: 'wealth.goal.updated', version: 1 },
    { key: 'wealth.networth.snapshot_created', version: 1 },
  ],
  presentations: [
    { key: 'wealth-snapshot.dashboard', version: 1 },
    { key: 'wealth-snapshot.accounts.list', version: 1 },
    { key: 'wealth-snapshot.assets.list', version: 1 },
    { key: 'wealth-snapshot.liabilities.list', version: 1 },
    { key: 'wealth-snapshot.goals.list', version: 1 },
  ],
  presentationsTargets: [
    {
      key: 'wealth-snapshot.dashboard',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'wealth-snapshot.assets.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'wealth-snapshot.liabilities.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'wealth-snapshot.goals.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
  ],
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'notifications', version: 1 },
    ],
    provides: [
      { key: 'accounts', version: 1 },
      { key: 'net-worth', version: 1 },
      { key: 'goals', version: 1 },
    ],
  },
};

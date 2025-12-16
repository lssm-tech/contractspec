import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const WealthSnapshotFeature: FeatureModuleSpec = {
  meta: {
    key: 'wealth-snapshot',
    title: 'Wealth Snapshot',
    description:
      'Mini-app for accounts, assets, liabilities, goals, and net worth.',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'net-worth', 'goals'],
    stability: 'experimental',
  },
  operations: [
    { name: 'wealth.account.create', version: 1 },
    { name: 'wealth.asset.add', version: 1 },
    { name: 'wealth.liability.add', version: 1 },
    { name: 'wealth.goal.create', version: 1 },
    { name: 'wealth.goal.update', version: 1 },
    { name: 'wealth.networth.get', version: 1 },
  ],
  events: [
    { name: 'wealth.asset.added', version: 1 },
    { name: 'wealth.liability.added', version: 1 },
    { name: 'wealth.goal.updated', version: 1 },
    { name: 'wealth.networth.snapshot_created', version: 1 },
  ],
  presentations: [
    { name: 'wealth-snapshot.dashboard', version: 1 },
    { name: 'wealth-snapshot.accounts.list', version: 1 },
    { name: 'wealth-snapshot.assets.list', version: 1 },
    { name: 'wealth-snapshot.liabilities.list', version: 1 },
    { name: 'wealth-snapshot.goals.list', version: 1 },
  ],
  presentationsTargets: [
    {
      name: 'wealth-snapshot.dashboard',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'wealth-snapshot.assets.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'wealth-snapshot.liabilities.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'wealth-snapshot.goals.list',
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

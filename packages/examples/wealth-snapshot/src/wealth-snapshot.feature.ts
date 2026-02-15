import { defineFeature } from '@contractspec/lib.contracts-spec';

export const WealthSnapshotFeature = defineFeature({
  meta: {
    key: 'wealth-snapshot',
    version: '1.0.0',
    title: 'Wealth Snapshot',
    description:
      'Mini-app for accounts, assets, liabilities, goals, and net worth.',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'net-worth', 'goals'],
    stability: 'experimental',
  },
  operations: [
    { key: 'wealth.account.create', version: '1.0.0' },
    { key: 'wealth.asset.add', version: '1.0.0' },
    { key: 'wealth.liability.add', version: '1.0.0' },
    { key: 'wealth.goal.create', version: '1.0.0' },
    { key: 'wealth.goal.update', version: '1.0.0' },
    { key: 'wealth.networth.get', version: '1.0.0' },
  ],
  events: [
    { key: 'wealth.asset.added', version: '1.0.0' },
    { key: 'wealth.liability.added', version: '1.0.0' },
    { key: 'wealth.goal.updated', version: '1.0.0' },
    { key: 'wealth.networth.snapshot_created', version: '1.0.0' },
  ],
  presentations: [
    { key: 'wealth-snapshot.dashboard', version: '1.0.0' },
    { key: 'wealth-snapshot.accounts.list', version: '1.0.0' },
    { key: 'wealth-snapshot.assets.list', version: '1.0.0' },
    { key: 'wealth-snapshot.liabilities.list', version: '1.0.0' },
    { key: 'wealth-snapshot.goals.list', version: '1.0.0' },
  ],
  presentationsTargets: [
    {
      key: 'wealth-snapshot.dashboard',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'wealth-snapshot.assets.list',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'wealth-snapshot.liabilities.list',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'wealth-snapshot.goals.list',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
  ],
  capabilities: {
    requires: [
      { key: 'identity', version: '1.0.0' },
      { key: 'audit-trail', version: '1.0.0' },
      { key: 'notifications', version: '1.0.0' },
    ],
    provides: [
      { key: 'accounts', version: '1.0.0' },
      { key: 'net-worth', version: '1.0.0' },
      { key: 'goals', version: '1.0.0' },
    ],
  },
});

import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';

export const WealthDashboardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'wealth-snapshot.dashboard',
    version: 1,
    description: 'Wealth snapshot dashboard with net worth overview',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'wealth', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'WealthDashboard',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['wealth.dashboard.enabled'],
  },
};

export const AccountsListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'wealth-snapshot.accounts.list',
    version: 1,
    description: 'List of financial accounts',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'accounts', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AccountsList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['wealth.accounts.enabled'],
  },
};

export const AssetsListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'wealth-snapshot.assets.list',
    version: 1,
    description: 'List of assets with valuations',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'assets', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'AssetsList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['wealth.assets.enabled'],
  },
};

export const LiabilitiesListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'wealth-snapshot.liabilities.list',
    version: 1,
    description: 'List of liabilities and debts',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'liabilities', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LiabilitiesList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['wealth.liabilities.enabled'],
  },
};

export const GoalsListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'wealth-snapshot.goals.list',
    version: 1,
    description: 'List of financial goals with progress',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'goals', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'GoalsList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['wealth.goals.enabled'],
  },
};

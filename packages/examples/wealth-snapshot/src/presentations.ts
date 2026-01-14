import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts';

export const WealthDashboardPresentation = definePresentation({
  meta: {
    key: 'wealth-snapshot.dashboard',
    version: '1.0.0',
    title: 'Wealth Dashboard',
    description: 'Wealth snapshot dashboard with net worth overview',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'wealth', 'dashboard'],
    stability: StabilityEnum.Experimental,
    goal: 'Overview of wealth',
    context: 'Dashboard',
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
});

export const AccountsListPresentation = definePresentation({
  meta: {
    key: 'wealth-snapshot.accounts.list',
    version: '1.0.0',
    title: 'Accounts List',
    description: 'List of financial accounts',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'accounts', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'List accounts',
    context: 'Overview',
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
});

export const AssetsListPresentation = definePresentation({
  meta: {
    key: 'wealth-snapshot.assets.list',
    version: '1.0.0',
    title: 'Assets List',
    description: 'List of assets with valuations',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'assets', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'List assets',
    context: 'Overview',
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
});

export const LiabilitiesListPresentation = definePresentation({
  meta: {
    key: 'wealth-snapshot.liabilities.list',
    version: '1.0.0',
    title: 'Liabilities List',
    description: 'List of liabilities and debts',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'liabilities', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'List liabilities',
    context: 'Overview',
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
});

export const GoalsListPresentation = definePresentation({
  meta: {
    key: 'wealth-snapshot.goals.list',
    version: '1.0.0',
    title: 'Goals List',
    description: 'List of financial goals with progress',
    domain: 'finance',
    owners: ['@wealth-snapshot'],
    tags: ['finance', 'goals', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'List goals',
    context: 'Overview',
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
});

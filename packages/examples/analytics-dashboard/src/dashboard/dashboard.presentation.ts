import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { DashboardModel } from './dashboard.schema';

export const DashboardsListPresentation: PresentationSpec = {
  meta: {
    key: 'analytics.dashboard.list',
    version: 1,
    title: 'Dashboards List',
    description: 'List of analytics dashboards',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'dashboards', 'list'],
    stability: StabilityEnum.Experimental,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'DashboardsList',
    props: DashboardModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: {
    flags: ['analytics.dashboards.enabled'],
  },
};

export const DashboardViewPresentation: PresentationSpec = {
  meta: {
    key: 'analytics.dashboard.view',
    version: 1,
    title: 'Dashboard View',
    description: 'View a single dashboard with widgets',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'dashboard', 'view'],
    stability: StabilityEnum.Experimental,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'DashboardView',
    props: DashboardModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['analytics.dashboards.enabled'],
  },
};

export const DashboardEditorPresentation: PresentationSpec = {
  meta: {
    key: 'analytics.dashboard.editor',
    version: 1,
    title: 'Dashboard Editor',
    description: 'Edit dashboard configuration and widgets',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'dashboard', 'editor'],
    stability: StabilityEnum.Experimental,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'DashboardEditor',
    props: DashboardModel,
  },
  targets: ['react'],
  policy: {
    flags: ['analytics.dashboards.enabled'],
  },
};

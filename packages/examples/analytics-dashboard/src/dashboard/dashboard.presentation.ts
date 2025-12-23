import type { PresentationSpec } from '@lssm/lib.contracts';
import { DashboardModel } from './dashboard.schema';

export const DashboardsListPresentation: PresentationSpec = {
  meta: {
    name: 'analytics.dashboard.list',
    version: 1,
    description: 'List of analytics dashboards',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'dashboards', 'list'],
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
    name: 'analytics.dashboard.view',
    version: 1,
    description: 'View a single dashboard with widgets',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'dashboard', 'view'],
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
    name: 'analytics.dashboard.editor',
    version: 1,
    description: 'Edit dashboard configuration and widgets',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'dashboard', 'editor'],
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

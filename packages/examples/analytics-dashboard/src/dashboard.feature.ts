/**
 * Analytics Dashboard Feature Module
 *
 * Comprehensive analytics and dashboarding solution for data visualization
 * and reporting across the platform.
 */

import * as dashboard from './dashboard';
import * as query from './query';
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

// ============ Feature Definition ============

export const AnalyticsDashboardFeature: FeatureModuleSpec = {
  meta: {
    key: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Analytics dashboards with customizable widgets and queries',
    domain: 'analytics',
    owners: ['analytics-team'],
    tags: ['analytics', 'dashboards', 'widgets', 'queries'],
    stability: 'experimental',
  },

  // ============ Dependencies ============
  dependencies: [
    '@lssm/lib.schema',
    '@lssm/lib.contracts',
    '@lssm/lib.identity-rbac',
    '@lssm/lib.metering',
    '@lssm/module.audit-trail',
    '@lssm/module.notifications',
  ],

  // ============ Contracts ============
  contracts: {
    // Dashboard management
    createDashboard: dashboard.CreateDashboardContract,
    addWidget: dashboard.AddWidgetContract,
    getDashboard: dashboard.GetDashboardContract,
    listDashboards: dashboard.ListDashboardsContract,

    // Query management
    createQuery: query.CreateQueryContract,
    executeQuery: query.ExecuteQueryContract,
  },

  // ============ Permissions ============
  permissions: {
    'dashboard:view': {
      description: 'View dashboards',
      defaultRoles: ['viewer', 'analyst', 'admin'],
    },
    'dashboard:create': {
      description: 'Create dashboards',
      defaultRoles: ['analyst', 'admin'],
    },
    'dashboard:edit': {
      description: 'Edit dashboards',
      defaultRoles: ['analyst', 'admin'],
    },
    'dashboard:delete': {
      description: 'Delete dashboards',
      defaultRoles: ['admin'],
    },
    'dashboard:share': {
      description: 'Share dashboards externally',
      defaultRoles: ['analyst', 'admin'],
    },
    'query:create': {
      description: 'Create queries',
      defaultRoles: ['analyst', 'admin'],
    },
    'query:execute': {
      description: 'Execute queries',
      defaultRoles: ['viewer', 'analyst', 'admin'],
    },
    'report:schedule': {
      description: 'Schedule automated reports',
      defaultRoles: ['analyst', 'admin'],
    },
  },

  // ============ Feature Flags ============
  featureFlags: {
    ANALYTICS_SQL_QUERIES: {
      description: 'Enable SQL query support',
      defaultValue: false,
    },
    ANALYTICS_SCHEDULED_REPORTS: {
      description: 'Enable scheduled report generation',
      defaultValue: true,
    },
    ANALYTICS_PUBLIC_DASHBOARDS: {
      description: 'Allow public dashboard sharing',
      defaultValue: false,
    },
    ANALYTICS_ADVANCED_WIDGETS: {
      description: 'Enable advanced widget types (maps, funnels)',
      defaultValue: true,
    },
    ANALYTICS_QUERY_CACHING: {
      description: 'Enable query result caching',
      defaultValue: true,
    },
  },

  // ============ Metrics ============
  metrics: {
    dashboards_created: {
      name: 'Dashboards Created',
      unit: 'count',
      aggregation: 'count',
    },
    widgets_added: {
      name: 'Widgets Added',
      unit: 'count',
      aggregation: 'count',
    },
    queries_executed: {
      name: 'Queries Executed',
      unit: 'count',
      aggregation: 'count',
    },
    query_execution_time: {
      name: 'Query Execution Time',
      unit: 'milliseconds',
      aggregation: 'avg',
    },
    dashboard_views: {
      name: 'Dashboard Views',
      unit: 'count',
      aggregation: 'count',
    },
    reports_generated: {
      name: 'Reports Generated',
      unit: 'count',
      aggregation: 'count',
    },
  },

  // ============ Routes ============
  routes: {
    '/dashboards': {
      presentation: 'analytics.dashboards.list',
      permission: 'dashboard:view',
    },
    '/dashboards/new': {
      presentation: 'analytics.dashboard.editor',
      permission: 'dashboard:create',
    },
    '/dashboards/:slug': {
      presentation: 'analytics.dashboard.view',
      permission: 'dashboard:view',
    },
    '/dashboards/:slug/edit': {
      presentation: 'analytics.dashboard.editor',
      permission: 'dashboard:edit',
    },
    '/queries': {
      presentation: 'analytics.queries.list',
      permission: 'query:create',
    },
    '/queries/builder': {
      presentation: 'analytics.query.builder',
      permission: 'query:create',
    },
  },
};

/**
 * Analytics Dashboard Feature Module
 *
 * Comprehensive analytics and dashboarding solution for data visualization
 * and reporting across the platform.
 *
 * This feature module bundles all dashboard and query operations, events,
 * and presentations into an installable feature following FeatureModuleSpec.
 */

import type { FeatureModuleSpec } from '@lssm/lib.contracts';

// ============ Feature Definition ============

export const AnalyticsDashboardFeature: FeatureModuleSpec = {
  meta: {
    key: 'analytics-dashboard',
    version: 1,
    title: 'Analytics Dashboard',
    description: 'Analytics dashboards with customizable widgets and queries',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'dashboards', 'widgets', 'queries'],
    stability: 'experimental',
  },

  // ============ Contract Operations ============
  // All contract operations included in this feature (OpRef[])
  operations: [
    // Dashboard operations
    { key: 'analytics.dashboard.create', version: 1 },
    { key: 'analytics.dashboard.list', version: 1 },
    { key: 'analytics.dashboard.get', version: 1 },

    // Widget operations
    { key: 'analytics.widget.add', version: 1 },

    // Query operations
    { key: 'analytics.query.create', version: 1 },
    { key: 'analytics.query.execute', version: 1 },
  ],

  // ============ Events ============
  // Events emitted by this feature (EventRef[])
  events: [
    // Dashboard events
    { key: 'analytics.dashboard.created', version: 1 },

    // Widget events
    { key: 'analytics.widget.added', version: 1 },

    // Query events
    { key: 'analytics.query.created', version: 1 },
  ],

  // ============ Presentations ============
  // Presentations associated with this feature (PresentationRef[])
  presentations: [
    // Dashboard presentations
    { key: 'analytics.dashboard.list', version: 1 },
    { key: 'analytics.dashboard.view', version: 1 },
    { key: 'analytics.dashboard.editor', version: 1 },

    // Query presentations
    { key: 'analytics.query.list', version: 1 },
    { key: 'analytics.query.builder', version: 1 },
  ],

  // ============ Op-to-Presentation Links ============
  // Links operations to their primary presentations
  opToPresentation: [
    {
      op: { key: 'analytics.dashboard.list', version: 1 },
      pres: { key: 'analytics.dashboard.list', version: 1 },
    },
    {
      op: { key: 'analytics.dashboard.get', version: 1 },
      pres: { key: 'analytics.dashboard.view', version: 1 },
    },
    {
      op: { key: 'analytics.dashboard.create', version: 1 },
      pres: { key: 'analytics.dashboard.editor', version: 1 },
    },
    {
      op: { key: 'analytics.query.create', version: 1 },
      pres: { key: 'analytics.query.builder', version: 1 },
    },
  ],

  // ============ Presentation Targets ============
  // Target requirements for multi-surface rendering
  presentationsTargets: [
    {
      key: 'analytics.dashboard.list',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      key: 'analytics.dashboard.view',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'analytics.dashboard.editor',
      version: 1,
      targets: ['react'],
    },
    {
      key: 'analytics.query.builder',
      version: 1,
      targets: ['react'],
    },
  ],

  // ============ Capabilities ============
  // Capability requirements for this feature
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'metering', version: 1 },
      { key: 'audit-trail', version: 1 },
    ],
  },
};

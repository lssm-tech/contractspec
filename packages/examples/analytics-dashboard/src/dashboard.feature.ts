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
    title: 'Analytics Dashboard',
    description: 'Analytics dashboards with customizable widgets and queries',
    domain: 'analytics',
    owners: ['@example.analytics-dashboard'],
    tags: ['analytics', 'dashboards', 'widgets', 'queries'],
    stability: 'experimental',
  },

  // ============ Contract Operations ============
  // All contract operations included in this feature (OpRef[])
  operations: [
    // Dashboard operations
    { name: 'analytics.dashboard.create', version: 1 },
    { name: 'analytics.dashboard.list', version: 1 },
    { name: 'analytics.dashboard.get', version: 1 },

    // Widget operations
    { name: 'analytics.widget.add', version: 1 },

    // Query operations
    { name: 'analytics.query.create', version: 1 },
    { name: 'analytics.query.execute', version: 1 },
  ],

  // ============ Events ============
  // Events emitted by this feature (EventRef[])
  events: [
    // Dashboard events
    { name: 'analytics.dashboard.created', version: 1 },

    // Widget events
    { name: 'analytics.widget.added', version: 1 },

    // Query events
    { name: 'analytics.query.created', version: 1 },
  ],

  // ============ Presentations ============
  // Presentations associated with this feature (PresentationRef[])
  presentations: [
    // Dashboard presentations
    { name: 'analytics.dashboard.list', version: 1 },
    { name: 'analytics.dashboard.view', version: 1 },
    { name: 'analytics.dashboard.editor', version: 1 },

    // Query presentations
    { name: 'analytics.query.list', version: 1 },
    { name: 'analytics.query.builder', version: 1 },
  ],

  // ============ Op-to-Presentation Links ============
  // Links operations to their primary presentations
  opToPresentation: [
    {
      op: { name: 'analytics.dashboard.list', version: 1 },
      pres: { name: 'analytics.dashboard.list', version: 1 },
    },
    {
      op: { name: 'analytics.dashboard.get', version: 1 },
      pres: { name: 'analytics.dashboard.view', version: 1 },
    },
    {
      op: { name: 'analytics.dashboard.create', version: 1 },
      pres: { name: 'analytics.dashboard.editor', version: 1 },
    },
    {
      op: { name: 'analytics.query.create', version: 1 },
      pres: { name: 'analytics.query.builder', version: 1 },
    },
  ],

  // ============ Presentation Targets ============
  // Target requirements for multi-surface rendering
  presentationsTargets: [
    {
      name: 'analytics.dashboard.list',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      name: 'analytics.dashboard.view',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'analytics.dashboard.editor',
      version: 1,
      targets: ['react'],
    },
    {
      name: 'analytics.query.builder',
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

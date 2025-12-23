/**
 * CRM Pipeline Feature Module Specification
 *
 * Defines the feature module for CRM and sales pipeline capabilities.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * CRM Pipeline feature module that bundles deal management,
 * pipeline operations, and contact management into an installable feature.
 */
export const CrmPipelineFeature: FeatureModuleSpec = {
  meta: {
    key: 'crm-pipeline',
    title: 'CRM Pipeline',
    description:
      'CRM and sales pipeline management with deals, contacts, and companies',
    domain: 'crm',
    owners: ['@crm-team'],
    tags: ['crm', 'sales', 'pipeline', 'deals'],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  operations: [
    // Deal operations
    { name: 'crm.deal.create', version: 1 },
    { name: 'crm.deal.move', version: 1 },
    { name: 'crm.deal.win', version: 1 },
    { name: 'crm.deal.lose', version: 1 },
    { name: 'crm.deal.list', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Deal events
    { name: 'deal.created', version: 1 },
    { name: 'deal.moved', version: 1 },
    { name: 'deal.won', version: 1 },
    { name: 'deal.lost', version: 1 },

    // Contact events
    { name: 'contact.created', version: 1 },

    // Task events
    { name: 'task.completed', version: 1 },
  ],

  // Presentations associated with this feature
  presentations: [
    { name: 'crm.dashboard', version: 1 },
    { name: 'crm.pipeline.kanban', version: 1 },
    { name: 'crm.deal.list', version: 1 },
    { name: 'crm.deal.detail', version: 1 },
    { name: 'crm.deal.card', version: 1 },
    { name: 'crm.pipeline.metrics', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { name: 'crm.deal.list', version: 1 },
      pres: { name: 'crm.pipeline.kanban', version: 1 },
    },
    {
      op: { name: 'crm.deal.move', version: 1 },
      pres: { name: 'crm.pipeline.kanban', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    { name: 'crm.dashboard', version: 1, targets: ['react', 'markdown'] },
    { name: 'crm.pipeline.kanban', version: 1, targets: ['react', 'markdown'] },
    {
      name: 'crm.deal.list',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      name: 'crm.pipeline.metrics',
      version: 1,
      targets: ['react', 'markdown'],
    },
  ],

  // Capability requirements
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'notifications', version: 1 },
    ],
  },
};

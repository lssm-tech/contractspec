/**
 * CRM Pipeline Feature Module Specification
 *
 * Defines the feature module for CRM and sales pipeline capabilities.
 */
import { defineFeature } from '@contractspec/lib.contracts';

/**
 * CRM Pipeline feature module that bundles deal management,
 * pipeline operations, and contact management into an installable feature.
 */
export const CrmPipelineFeature = defineFeature({
  meta: {
    key: 'crm-pipeline',
    title: 'CRM Pipeline',
    description:
      'CRM and sales pipeline management with deals, contacts, and companies',
    domain: 'crm',
    owners: ['@crm-team'],
    tags: ['crm', 'sales', 'pipeline', 'deals'],
    stability: 'experimental',
    version: '1.0.0',
  },

  // All contract operations included in this feature
  operations: [
    // Deal operations
    { key: 'crm.deal.create', version: '1.0.0' },
    { key: 'crm.deal.move', version: '1.0.0' },
    { key: 'crm.deal.win', version: '1.0.0' },
    { key: 'crm.deal.lose', version: '1.0.0' },
    { key: 'crm.deal.list', version: '1.0.0' },
  ],

  // Events emitted by this feature
  events: [
    // Deal events
    { key: 'deal.created', version: '1.0.0' },
    { key: 'deal.moved', version: '1.0.0' },
    { key: 'deal.won', version: '1.0.0' },
    { key: 'deal.lost', version: '1.0.0' },

    // Contact events
    { key: 'contact.created', version: '1.0.0' },

    // Task events
    { key: 'task.completed', version: '1.0.0' },
  ],

  // Presentations associated with this feature
  presentations: [
    { key: 'crm.dashboard', version: '1.0.0' },
    { key: 'crm.pipeline.kanban', version: '1.0.0' },
    { key: 'crm.deal.viewList', version: '1.0.0' },
    { key: 'crm.deal.detail', version: '1.0.0' },
    { key: 'crm.deal.card', version: '1.0.0' },
    { key: 'crm.pipeline.metrics', version: '1.0.0' },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { key: 'crm.deal.list', version: '1.0.0' },
      pres: { key: 'crm.pipeline.kanban', version: '1.0.0' },
    },
    {
      op: { key: 'crm.deal.move', version: '1.0.0' },
      pres: { key: 'crm.pipeline.kanban', version: '1.0.0' },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    { key: 'crm.dashboard', version: '1.0.0', targets: ['react', 'markdown'] },
    {
      key: 'crm.pipeline.kanban',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'crm.deal.list',
      version: '1.0.0',
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      key: 'crm.pipeline.metrics',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
  ],

  // Capability requirements
  capabilities: {
    requires: [
      { key: 'identity', version: '1.0.0' },
      { key: 'audit-trail', version: '1.0.0' },
      { key: 'notifications', version: '1.0.0' },
    ],
  },
});

/**
 * SaaS Boilerplate Feature Module Specification
 *
 * Defines the feature module for the SaaS application foundation.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * SaaS Boilerplate feature module that bundles project management,
 * billing, and settings operations into an installable feature.
 */
export const SaasBoilerplateFeature: FeatureModuleSpec = {
  meta: {
    key: 'saas-boilerplate',
    title: 'SaaS Boilerplate',
    description:
      'SaaS application foundation with projects, billing, and settings',
    domain: 'saas',
    owners: ['@saas-team'],
    tags: ['saas', 'projects', 'billing'],
    stability: 'experimental',
    version: 1,
  },

  // All contract operations included in this feature
  operations: [
    // Project operations
    { key: 'saas.project.create', version: 1 },
    { key: 'saas.project.get', version: 1 },
    { key: 'saas.project.update', version: 1 },
    { key: 'saas.project.delete', version: 1 },
    { key: 'saas.project.list', version: 1 },

    // Billing operations
    { key: 'saas.billing.subscription.get', version: 1 },
    { key: 'saas.billing.usage.record', version: 1 },
    { key: 'saas.billing.usage.summary', version: 1 },
    { key: 'saas.billing.feature.check', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Project events
    { key: 'project.created', version: 1 },
    { key: 'project.updated', version: 1 },
    { key: 'project.deleted', version: 1 },
    { key: 'project.archived', version: 1 },

    // Billing events
    { key: 'billing.usage.recorded', version: 1 },
    { key: 'billing.subscription.changed', version: 1 },
    { key: 'billing.limit.reached', version: 1 },
  ],

  // Presentations associated with this feature
  presentations: [
    { key: 'saas.dashboard', version: 1 },
    { key: 'saas.project.list', version: 1 },
    { key: 'saas.project.detail', version: 1 },
    { key: 'saas.billing.subscription', version: 1 },
    { key: 'saas.billing.usage', version: 1 },
    { key: 'saas.settings', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { key: 'saas.project.list', version: 1 },
      pres: { key: 'saas.project.list', version: 1 },
    },
    {
      op: { key: 'saas.project.get', version: 1 },
      pres: { key: 'saas.project.detail', version: 1 },
    },
    {
      op: { key: 'saas.billing.subscription.get', version: 1 },
      pres: { key: 'saas.billing.subscription', version: 1 },
    },
    {
      op: { key: 'saas.billing.usage.summary', version: 1 },
      pres: { key: 'saas.billing.usage', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    { key: 'saas.dashboard', version: 1, targets: ['react', 'markdown'] },
    {
      key: 'saas.project.list',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      key: 'saas.billing.subscription',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { key: 'saas.billing.usage', version: 1, targets: ['react', 'markdown'] },
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

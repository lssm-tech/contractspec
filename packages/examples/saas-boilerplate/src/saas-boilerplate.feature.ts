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
  },

  // All contract operations included in this feature
  operations: [
    // Project operations
    { name: 'saas.project.create', version: 1 },
    { name: 'saas.project.get', version: 1 },
    { name: 'saas.project.update', version: 1 },
    { name: 'saas.project.delete', version: 1 },
    { name: 'saas.project.list', version: 1 },

    // Billing operations
    { name: 'saas.billing.subscription.get', version: 1 },
    { name: 'saas.billing.usage.record', version: 1 },
    { name: 'saas.billing.usage.summary', version: 1 },
    { name: 'saas.billing.feature.check', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Project events
    { name: 'project.created', version: 1 },
    { name: 'project.updated', version: 1 },
    { name: 'project.deleted', version: 1 },

    // Billing events
    { name: 'billing.usage.recorded', version: 1 },
    { name: 'billing.subscription.changed', version: 1 },
    { name: 'billing.limit.reached', version: 1 },
  ],

  // Presentations associated with this feature
  presentations: [
    { name: 'saas.dashboard', version: 1 },
    { name: 'saas.project.list', version: 1 },
    { name: 'saas.project.detail', version: 1 },
    { name: 'saas.billing.subscription', version: 1 },
    { name: 'saas.billing.usage', version: 1 },
    { name: 'saas.settings', version: 1 },
  ],

  // Link operations to their primary presentations
  opToPresentation: [
    {
      op: { name: 'saas.project.list', version: 1 },
      pres: { name: 'saas.project.list', version: 1 },
    },
    {
      op: { name: 'saas.project.get', version: 1 },
      pres: { name: 'saas.project.detail', version: 1 },
    },
    {
      op: { name: 'saas.billing.subscription.get', version: 1 },
      pres: { name: 'saas.billing.subscription', version: 1 },
    },
    {
      op: { name: 'saas.billing.usage.summary', version: 1 },
      pres: { name: 'saas.billing.usage', version: 1 },
    },
  ],

  // Target requirements for multi-surface rendering
  presentationsTargets: [
    { name: 'saas.dashboard', version: 1, targets: ['react', 'markdown'] },
    {
      name: 'saas.project.list',
      version: 1,
      targets: ['react', 'markdown', 'application/json'],
    },
    {
      name: 'saas.billing.subscription',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { name: 'saas.billing.usage', version: 1, targets: ['react', 'markdown'] },
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

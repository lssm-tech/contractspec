/**
 * Feature Flags Feature Module Specification
 *
 * Defines the feature module for feature flag and experiment management.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Feature Flags feature module that bundles flag management,
 * targeting rules, and A/B experiment capabilities.
 */
export const FeatureFlagsFeature: FeatureModuleSpec = {
  meta: {
    key: 'feature-flags',
    title: 'Feature Flags',
    description:
      'Feature flag management with targeting rules and A/B experiments',
    domain: 'platform',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'experiments', 'targeting'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    // Flag CRUD operations
    { name: 'flag.create', version: 1 },
    { name: 'flag.update', version: 1 },
    { name: 'flag.delete', version: 1 },
    { name: 'flag.toggle', version: 1 },
    { name: 'flag.get', version: 1 },
    { name: 'flag.list', version: 1 },
    { name: 'flag.evaluate', version: 1 },

    // Targeting rule operations
    { name: 'flag.rule.create', version: 1 },
    { name: 'flag.rule.delete', version: 1 },

    // Experiment operations
    { name: 'experiment.create', version: 1 },
    { name: 'experiment.start', version: 1 },
    { name: 'experiment.stop', version: 1 },
    { name: 'experiment.get', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Flag events
    { name: 'flag.created', version: 1 },
    { name: 'flag.updated', version: 1 },
    { name: 'flag.deleted', version: 1 },
    { name: 'flag.toggled', version: 1 },
    { name: 'flag.evaluated', version: 1 },

    // Rule events
    { name: 'flag.rule_created', version: 1 },
    { name: 'flag.rule_deleted', version: 1 },

    // Experiment events
    { name: 'experiment.created', version: 1 },
    { name: 'experiment.started', version: 1 },
    { name: 'experiment.stopped', version: 1 },
    { name: 'experiment.variant_assigned', version: 1 },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'feature-flags', version: 1 },
      { key: 'experiments', version: 1 },
    ],
    requires: [{ key: 'identity', version: 1 }],
  },
};

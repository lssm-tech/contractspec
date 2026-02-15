/**
 * Feature Flags Feature Module Specification
 *
 * Defines the feature module for feature flag and experiment management.
 */
import { defineFeature } from '@contractspec/lib.contracts-spec';

/**
 * Feature Flags feature module that bundles flag management,
 * targeting rules, and A/B experiment capabilities.
 */
export const FeatureFlagsFeature = defineFeature({
  meta: {
    key: 'feature-flags',
    version: '1.0.0',
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
    { key: 'flag.create', version: '1.0.0' },
    { key: 'flag.update', version: '1.0.0' },
    { key: 'flag.delete', version: '1.0.0' },
    { key: 'flag.toggle', version: '1.0.0' },
    { key: 'flag.get', version: '1.0.0' },
    { key: 'flag.list', version: '1.0.0' },
    { key: 'flag.evaluate', version: '1.0.0' },

    // Targeting rule operations
    { key: 'flag.rule.create', version: '1.0.0' },
    { key: 'flag.rule.delete', version: '1.0.0' },

    // Experiment operations
    { key: 'experiment.create', version: '1.0.0' },
    { key: 'experiment.start', version: '1.0.0' },
    { key: 'experiment.stop', version: '1.0.0' },
    { key: 'experiment.get', version: '1.0.0' },
  ],

  // Events emitted by this feature
  events: [
    // Flag events
    { key: 'flag.created', version: '1.0.0' },
    { key: 'flag.updated', version: '1.0.0' },
    { key: 'flag.deleted', version: '1.0.0' },
    { key: 'flag.toggled', version: '1.0.0' },
    { key: 'flag.evaluated', version: '1.0.0' },

    // Rule events
    { key: 'flag.rule_created', version: '1.0.0' },
    { key: 'flag.rule_deleted', version: '1.0.0' },

    // Experiment events
    { key: 'experiment.created', version: '1.0.0' },
    { key: 'experiment.started', version: '1.0.0' },
    { key: 'experiment.stopped', version: '1.0.0' },
    { key: 'experiment.variant_assigned', version: '1.0.0' },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'feature-flag', version: '1.0.0' },
      { key: 'experiments', version: '1.0.0' },
    ],
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});

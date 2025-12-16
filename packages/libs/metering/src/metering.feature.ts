/**
 * Metering Feature Module Specification
 *
 * Defines the feature module for usage metering and threshold management.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Metering feature module that bundles metric definitions,
 * usage tracking, and threshold alerting capabilities.
 */
export const MeteringFeature: FeatureModuleSpec = {
  meta: {
    key: 'metering',
    title: 'Usage Metering',
    description:
      'Usage metering, metric definitions, and threshold alerting',
    domain: 'platform',
    owners: ['@platform.metering'],
    tags: ['metering', 'usage', 'billing', 'thresholds'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    // Metric operations
    { name: 'metric.define', version: 1 },
    { name: 'metric.update', version: 1 },
    { name: 'metric.delete', version: 1 },
    { name: 'metric.get', version: 1 },
    { name: 'metric.list', version: 1 },

    // Usage operations
    { name: 'usage.record', version: 1 },
    { name: 'usage.recordBatch', version: 1 },
    { name: 'usage.get', version: 1 },
    { name: 'usage.getSummary', version: 1 },

    // Threshold operations
    { name: 'threshold.create', version: 1 },
    { name: 'threshold.update', version: 1 },
    { name: 'threshold.delete', version: 1 },
    { name: 'threshold.list', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // Metric events
    { name: 'metric.defined', version: 1 },
    { name: 'metric.updated', version: 1 },

    // Usage events
    { name: 'usage.recorded', version: 1 },
    { name: 'usage.batch_recorded', version: 1 },
    { name: 'usage.aggregated', version: 1 },

    // Threshold events
    { name: 'threshold.created', version: 1 },
    { name: 'threshold.exceeded', version: 1 },
    { name: 'threshold.approaching', version: 1 },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'metering', version: 1 },
      { key: 'thresholds', version: 1 },
    ],
    requires: [],
  },
};


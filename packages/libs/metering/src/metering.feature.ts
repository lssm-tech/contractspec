/**
 * Metering Feature Module Specification
 *
 * Defines the feature module for usage metering and threshold management.
 */
import type { FeatureModuleSpec } from '@contractspec/lib.contracts';

/**
 * Metering feature module that bundles metric definitions,
 * usage tracking, and threshold alerting capabilities.
 */
export const MeteringFeature: FeatureModuleSpec = {
  meta: {
    key: 'metering',
    version: '1.0.0',
    title: 'Usage Metering',
    description: 'Usage metering, metric definitions, and threshold alerting',
    domain: 'platform',
    owners: ['@platform.metering'],
    tags: ['metering', 'usage', 'billing', 'thresholds'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    // Metric operations
    { key: 'metric.define', version: '1.0.0' },
    { key: 'metric.update', version: '1.0.0' },
    { key: 'metric.delete', version: '1.0.0' },
    { key: 'metric.get', version: '1.0.0' },
    { key: 'metric.list', version: '1.0.0' },

    // Usage operations
    { key: 'usage.record', version: '1.0.0' },
    { key: 'usage.recordBatch', version: '1.0.0' },
    { key: 'usage.get', version: '1.0.0' },
    { key: 'usage.getSummary', version: '1.0.0' },

    // Threshold operations
    { key: 'threshold.create', version: '1.0.0' },
    { key: 'threshold.update', version: '1.0.0' },
    { key: 'threshold.delete', version: '1.0.0' },
    { key: 'threshold.list', version: '1.0.0' },
  ],

  // Events emitted by this feature
  events: [
    // Metric events
    { key: 'metric.defined', version: '1.0.0' },
    { key: 'metric.updated', version: '1.0.0' },

    // Usage events
    { key: 'usage.recorded', version: '1.0.0' },
    { key: 'usage.batch_recorded', version: '1.0.0' },
    { key: 'usage.aggregated', version: '1.0.0' },

    // Threshold events
    { key: 'threshold.created', version: '1.0.0' },
    { key: 'threshold.exceeded', version: '1.0.0' },
    { key: 'threshold.approaching', version: '1.0.0' },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'metering', version: '1.0.0' },
      { key: 'thresholds', version: '1.0.0' },
    ],
    requires: [],
  },
};

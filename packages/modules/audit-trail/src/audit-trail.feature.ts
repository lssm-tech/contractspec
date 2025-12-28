/**
 * Audit Trail Feature Module Specification
 *
 * Defines the feature module for audit logging and compliance.
 */
import type { FeatureModuleSpec } from '@contractspec/lib.contracts';

/**
 * Audit Trail feature module that bundles audit log querying,
 * export, and statistics capabilities.
 */
export const AuditTrailFeature: FeatureModuleSpec = {
  meta: {
    key: 'audit-trail',
    title: 'Audit Trail',
    description: 'Audit logging, querying, export, and compliance reporting',
    domain: 'platform',
    version: 1,
    owners: ['@platform.audit-trail'],
    tags: ['audit', 'compliance', 'logging', 'security'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    { key: 'audit.logs.export', version: 1 },
    { key: 'audit.logs.query', version: 1 },
    { key: 'audit.logs.get', version: 1 },
    { key: 'audit.trace.get', version: 1 },
    { key: 'audit.stats', version: 1 },
  ],

  // No events for this feature - it consumes events, doesn't emit them
  events: [],

  // No presentations for this module feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'audit-trail', version: 1 }],
    requires: [],
  },
};

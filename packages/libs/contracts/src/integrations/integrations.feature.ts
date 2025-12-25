/**
 * Platform Integrations Feature Module Specification
 *
 * Defines the feature module for managing integration connections.
 */
import type { FeatureModuleSpec } from '../features';

/**
 * Platform Integrations feature module that bundles
 * integration connection management capabilities.
 */
export const IntegrationsFeature: FeatureModuleSpec = {
  meta: {
    key: 'platform.integrations',
    version: 1,
    title: 'Platform Integrations',
    description:
      'Manage integration connections to external providers (e.g., Stripe, Qdrant)',
    domain: 'platform',
    owners: ['@platform.integrations'],
    tags: ['integrations', 'connections', 'platform'],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  operations: [
    { key: 'integrations.connection.create', version: 1 },
    { key: 'integrations.connection.update', version: 1 },
    { key: 'integrations.connection.delete', version: 1 },
    { key: 'integrations.connection.list', version: 1 },
    { key: 'integrations.connection.test', version: 1 },
  ],

  // No events for this feature
  events: [],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'integrations', version: 1 }],
    requires: [{ key: 'identity', version: 1 }],
  },
};

/**
 * OpenBanking Integration Feature Module Specification
 *
 * Defines the feature module for open banking integrations.
 */
import type { FeatureModuleSpec } from '../../features';

/**
 * OpenBanking feature module that bundles account, balance,
 * and transaction synchronization capabilities.
 */
export const OpenBankingFeature: FeatureModuleSpec = {
  meta: {
    key: 'openbanking',
    title: 'Open Banking Integration',
    description:
      'Open banking account sync, balance refresh, and transaction synchronization',
    domain: 'integrations',
    owners: ['@platform.finance'],
    tags: ['open-banking', 'powens', 'finance', 'banking'],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  operations: [
    // Account operations
    { name: 'openbanking.accounts.sync', version: 1 },
    { name: 'openbanking.accounts.list', version: 1 },
    { name: 'openbanking.accounts.get', version: 1 },

    // Balance operations
    { name: 'openbanking.balances.refresh', version: 1 },
    { name: 'openbanking.balances.get', version: 1 },

    // Transaction operations
    { name: 'openbanking.transactions.sync', version: 1 },
    { name: 'openbanking.transactions.list', version: 1 },
  ],

  // No events for this integration feature
  events: [],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'openbanking', version: 1 }],
    requires: [{ key: 'identity', version: 1 }],
  },
};


/**
 * OpenBanking Integration Feature Module Specification
 *
 * Defines the feature module for open banking integrations.
 */
import { defineFeature } from '@contractspec/lib.contracts-spec/features';

/**
 * OpenBanking feature module that bundles account, balance,
 * and transaction synchronization capabilities.
 */
export const OpenBankingFeature = defineFeature({
  meta: {
    key: 'openbanking',
    version: '1.0.0',
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
    { key: 'openbanking.accounts.sync', version: '1.0.0' },
    { key: 'openbanking.accounts.list', version: '1.0.0' },
    { key: 'openbanking.accounts.get', version: '1.0.0' },

    // Balance operations
    { key: 'openbanking.balances.refresh', version: '1.0.0' },
    { key: 'openbanking.balances.get', version: '1.0.0' },

    // Transaction operations
    { key: 'openbanking.transactions.sync', version: '1.0.0' },
    { key: 'openbanking.transactions.list', version: '1.0.0' },
  ],

  // No events for this integration feature
  events: [],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'openbanking', version: '1.0.0' }],
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});

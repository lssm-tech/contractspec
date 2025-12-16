/**
 * Pocket Family Office Feature Module Specification
 *
 * Defines the feature module for personal finance automation.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Pocket Family Office feature module that bundles financial document
 * management, open banking integration, and automated summaries.
 */
export const PocketFamilyOfficeFeature: FeatureModuleSpec = {
  meta: {
    key: 'pocket-family-office',
    title: 'Pocket Family Office',
    description:
      'Personal finance automation with document ingestion, open banking, and AI summaries',
    domain: 'finance',
    owners: ['@platform.finance'],
    tags: [
      'finance',
      'open-banking',
      'documents',
      'automation',
      'family-office',
    ],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  // Note: Only pfo.documents.upload is defined using defineCommand and is scanned.
  // Other contracts use raw ContractSpec objects and are not automatically scanned.
  operations: [{ name: 'pfo.documents.upload', version: 1 }],

  // No events defined separately for this feature
  events: [],

  // No presentations for this example feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'pocket-family-office', version: 1 }],
    requires: [
      { key: 'identity', version: 1 },
      { key: 'openbanking', version: 1 },
    ],
  },
};

/**
 * Pocket Family Office Feature Module Specification
 *
 * Defines the feature module for personal finance automation.
 */
import { defineFeature } from '@contractspec/lib.contracts';

/**
 * Pocket Family Office feature module that bundles financial document
 * management, open banking integration, and automated summaries.
 */
export const PocketFamilyOfficeFeature = defineFeature({
  meta: {
    key: 'pocket-family-office',
    version: '1.0.0',
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
  operations: [
    { key: 'pfo.documents.upload', version: '1.0.0' },
    { key: 'pfo.reminders.schedule-payment', version: '1.0.0' },
    { key: 'pfo.summary.generate', version: '1.0.0' },
    { key: 'pfo.email.sync-threads', version: '1.0.0' },
    { key: 'pfo.summary.dispatch', version: '1.0.0' },
    { key: 'pfo.openbanking.generate-overview', version: '1.0.0' },
  ],

  // No events defined separately for this feature
  events: [],

  // No presentations for this example feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'pocket-family-office', version: '1.0.0' }],
    requires: [
      { key: 'identity', version: '1.0.0' },
      { key: 'openbanking', version: '1.0.0' },
    ],
  },
});

/**
 * Knowledge Sources Feature Module Specification
 *
 * Defines the feature module for managing knowledge sources.
 */
import { defineFeature } from '../features';

/**
 * Knowledge Sources feature module that bundles
 * knowledge source management capabilities.
 */
export const KnowledgeFeature = defineFeature({
  meta: {
    key: 'platform.knowledge',
    version: '1.0.0',
    title: 'Knowledge Sources',
    description:
      'Manage knowledge source bindings for ingestion (e.g., Notion, uploads)',
    domain: 'platform',
    owners: ['@platform.knowledge'],
    tags: ['knowledge', 'sources', 'platform', 'ingestion'],
    stability: 'experimental',
  },

  // All contract operations included in this feature
  operations: [
    { key: 'knowledge.source.create', version: '1.0.0' },
    { key: 'knowledge.source.update', version: '1.0.0' },
    { key: 'knowledge.source.delete', version: '1.0.0' },
    { key: 'knowledge.source.list', version: '1.0.0' },
    { key: 'knowledge.source.triggerSync', version: '1.0.0' },
  ],

  // No events for this feature
  events: [],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'knowledge', version: '1.0.0' }],
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});

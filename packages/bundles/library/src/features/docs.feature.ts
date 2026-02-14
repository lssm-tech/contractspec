import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';

/**
 * Documentation feature for ContractSpec.
 * Provides comprehensive documentation system including search and navigation.
 */
export const DocsFeature: FeatureModuleSpec = {
  meta: {
    key: 'contractspec.docs',
    version: '1.0.0',
    title: 'Documentation',
    description: 'Comprehensive documentation system for ContractSpec',
    domain: 'platform',
    owners: ['@platform.docs'],
    tags: ['documentation', 'guides', 'api-reference'],
    stability: 'stable',
  },
  operations: [
    { key: 'docs.search', version: '1.0.0' },
    { key: 'docs.navigate', version: '1.0.0' },
  ],
  events: [
    { key: 'docs.page_viewed', version: '1.0.0' },
    { key: 'docs.search_performed', version: '1.0.0' },
  ],
  presentations: [
    { key: 'docs.landing', version: '1.0.0' },
    { key: 'docs.getting-started', version: '1.0.0' },
    { key: 'docs.architecture', version: '1.0.0' },
  ],
  capabilities: {
    provides: [{ key: 'contracts.docs', version: '1.0.0' }],
    requires: [],
  },
};

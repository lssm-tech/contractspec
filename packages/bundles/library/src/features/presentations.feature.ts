import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';

/**
 * Presentations feature for ContractSpec.
 * Provides cross-platform rendering of contract-driven UI.
 */
export const PresentationsFeature: FeatureModuleSpec = {
  meta: {
    key: 'contractspec.presentations',
    version: '1.0.0',
    title: 'Presentation Runtime',
    description: 'Cross-platform rendering of contract-driven UI',
    domain: 'platform',
    owners: ['@platform.presentations'],
    tags: ['presentations', 'ui', 'rendering', 'cross-platform'],
    stability: 'beta',
  },
  operations: [
    { key: 'presentation.render', version: '1.0.0' },
    { key: 'presentation.transform', version: '1.0.0' },
  ],
  events: [
    { key: 'presentation.rendered', version: '1.0.0' },
    { key: 'presentation.transformed', version: '1.0.0' },
  ],
  presentations: [
    { key: 'form.standard', version: '1.0.0' },
    { key: 'list.standard', version: '1.0.0' },
    { key: 'detail.standard', version: '1.0.0' },
  ],
  capabilities: {
    provides: [{ key: 'contracts.presentations', version: '1.0.0' }],
    requires: [],
  },
};

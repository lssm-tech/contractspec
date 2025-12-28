import type { FeatureModuleSpec } from '@contractspec/lib.contracts';

export const VersionedKnowledgeBaseFeature: FeatureModuleSpec = {
  meta: {
    key: 'versioned-knowledge-base',
    version: '1.0.0',
    title: 'Versioned Knowledge Base',
    description:
      'Curated KB with immutable sources, rule versions, and published snapshots.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['knowledge', 'versioning', 'snapshots'],
    stability: 'experimental',
  },
  operations: [
    { key: 'kb.ingestSource', version: '1.0.0' },
    { key: 'kb.upsertRuleVersion', version: '1.0.0' },
    { key: 'kb.approveRuleVersion', version: '1.0.0' },
    { key: 'kb.publishSnapshot', version: '1.0.0' },
    { key: 'kb.search', version: '1.0.0' },
  ],
  events: [
    { key: 'kb.source.ingested', version: '1.0.0' },
    { key: 'kb.ruleVersion.created', version: '1.0.0' },
    { key: 'kb.ruleVersion.approved', version: '1.0.0' },
    { key: 'kb.snapshot.published', version: '1.0.0' },
  ],
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],
  capabilities: {
    requires: [{ key: 'knowledge', version: '1.0.0' }],
  },
};

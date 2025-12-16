import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const VersionedKnowledgeBaseFeature: FeatureModuleSpec = {
  meta: {
    key: 'versioned-knowledge-base',
    title: 'Versioned Knowledge Base',
    description:
      'Curated KB with immutable sources, rule versions, and published snapshots.',
    domain: 'knowledge',
    owners: ['examples'],
    tags: ['knowledge', 'versioning', 'snapshots'],
    stability: 'experimental',
  },
  operations: [
    { name: 'kb.ingestSource', version: 1 },
    { name: 'kb.upsertRuleVersion', version: 1 },
    { name: 'kb.approveRuleVersion', version: 1 },
    { name: 'kb.publishSnapshot', version: 1 },
    { name: 'kb.search', version: 1 },
  ],
  events: [
    { name: 'kb.source.ingested', version: 1 },
    { name: 'kb.ruleVersion.created', version: 1 },
    { name: 'kb.ruleVersion.approved', version: 1 },
    { name: 'kb.snapshot.published', version: 1 },
  ],
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],
  capabilities: {
    requires: [{ key: 'knowledge', version: 1 }],
  },
};

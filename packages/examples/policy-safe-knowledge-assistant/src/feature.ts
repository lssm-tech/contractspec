import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const PolicySafeKnowledgeAssistantFeature: FeatureModuleSpec = {
  meta: {
    key: 'policy-safe-knowledge-assistant',
    title: 'Policy-safe Knowledge Assistant',
    description:
      'All-in-one example composing locale/jurisdiction gate + versioned KB + HITL pipeline + learning hub.',
    domain: 'knowledge',
    owners: ['examples'],
    tags: ['assistant', 'knowledge', 'policy', 'hitl', 'learning'],
    stability: 'experimental',
  },
  operations: [
    // Gate
    { name: 'assistant.answer', version: 1 },
    { name: 'assistant.explainConcept', version: 1 },
    // KB
    { name: 'kb.ingestSource', version: 1 },
    { name: 'kb.upsertRuleVersion', version: 1 },
    { name: 'kb.approveRuleVersion', version: 1 },
    { name: 'kb.publishSnapshot', version: 1 },
    { name: 'kb.search', version: 1 },
    // Pipeline
    { name: 'kbPipeline.runWatch', version: 1 },
    { name: 'kbPipeline.createReviewTask', version: 1 },
    { name: 'kbPipeline.submitDecision', version: 1 },
    { name: 'kbPipeline.publishIfReady', version: 1 },
  ],
  events: [
    { name: 'assistant.answer.requested', version: 1 },
    { name: 'assistant.answer.blocked', version: 1 },
    { name: 'assistant.answer.delivered', version: 1 },
    { name: 'kb.source.ingested', version: 1 },
    { name: 'kb.ruleVersion.created', version: 1 },
    { name: 'kb.ruleVersion.approved', version: 1 },
    { name: 'kb.snapshot.published', version: 1 },
    { name: 'kb.change.detected', version: 1 },
    { name: 'kb.review.requested', version: 1 },
    { name: 'kb.review.decided', version: 1 },
  ],
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'notifications', version: 1 },
      { key: 'jobs', version: 1 },
      { key: 'feature-flags', version: 1 },
      { key: 'files', version: 1 },
      { key: 'metering', version: 1 },
      { key: 'learning-journey', version: 1 },
    ],
  },
};



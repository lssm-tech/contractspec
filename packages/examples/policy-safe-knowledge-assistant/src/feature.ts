import type { FeatureModuleSpec } from '@contractspec/lib.contracts';

export const PolicySafeKnowledgeAssistantFeature: FeatureModuleSpec = {
  meta: {
    key: 'policy-safe-knowledge-assistant',
    version: 1,
    title: 'Policy-safe Knowledge Assistant',
    description:
      'All-in-one example composing locale/jurisdiction gate + versioned KB + HITL pipeline + learning hub.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['assistant', 'knowledge', 'policy', 'hitl', 'learning'],
    stability: 'experimental',
  },
  operations: [
    // Gate
    { key: 'assistant.answer', version: 1 },
    { key: 'assistant.explainConcept', version: 1 },
    // KB
    { key: 'kb.ingestSource', version: 1 },
    { key: 'kb.upsertRuleVersion', version: 1 },
    { key: 'kb.approveRuleVersion', version: 1 },
    { key: 'kb.publishSnapshot', version: 1 },
    { key: 'kb.search', version: 1 },
    // Pipeline
    { key: 'kbPipeline.runWatch', version: 1 },
    { key: 'kbPipeline.createReviewTask', version: 1 },
    { key: 'kbPipeline.submitDecision', version: 1 },
    { key: 'kbPipeline.publishIfReady', version: 1 },
  ],
  events: [
    { key: 'assistant.answer.requested', version: 1 },
    { key: 'assistant.answer.blocked', version: 1 },
    { key: 'assistant.answer.delivered', version: 1 },
    { key: 'kb.source.ingested', version: 1 },
    { key: 'kb.ruleVersion.created', version: 1 },
    { key: 'kb.ruleVersion.approved', version: 1 },
    { key: 'kb.snapshot.published', version: 1 },
    { key: 'kb.change.detected', version: 1 },
    { key: 'kb.review.requested', version: 1 },
    { key: 'kb.review.decided', version: 1 },
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

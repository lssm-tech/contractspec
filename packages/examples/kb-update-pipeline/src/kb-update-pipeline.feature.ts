import type { FeatureModuleSpec } from '@contractspec/lib.contracts';

export const KbUpdatePipelineFeature: FeatureModuleSpec = {
  meta: {
    key: 'kb-update-pipeline',
    version: 1,
    title: 'KB Update Pipeline (HITL)',
    description:
      'Automation proposes KB patches; humans verify; publishing is blocked until approvals are complete.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['knowledge', 'pipeline', 'hitl', 'audit', 'notifications'],
    stability: 'experimental',
  },
  operations: [
    { key: 'kbPipeline.runWatch', version: 1 },
    { key: 'kbPipeline.createReviewTask', version: 1 },
    { key: 'kbPipeline.submitDecision', version: 1 },
    { key: 'kbPipeline.publishIfReady', version: 1 },
  ],
  events: [
    { key: 'kb.change.detected', version: 1 },
    { key: 'kb.change.summarized', version: 1 },
    { key: 'kb.patch.proposed', version: 1 },
    { key: 'kb.review.requested', version: 1 },
    { key: 'kb.review.decided', version: 1 },
  ],
  presentations: [
    { key: 'kb.dashboard', version: 1 },
    { key: 'kb.review.list', version: 1 },
    { key: 'kb.review.form', version: 1 },
  ],
  opToPresentation: [
    {
      op: { key: 'kbPipeline.runWatch', version: 1 },
      pres: { key: 'kb.dashboard', version: 1 },
    },
    {
      op: { key: 'kbPipeline.createReviewTask', version: 1 },
      pres: { key: 'kb.review.list', version: 1 },
    },
    {
      op: { key: 'kbPipeline.submitDecision', version: 1 },
      pres: { key: 'kb.review.form', version: 1 },
    },
  ],
  presentationsTargets: [
    { key: 'kb.dashboard', version: 1, targets: ['react', 'markdown'] },
    { key: 'kb.review.list', version: 1, targets: ['react', 'markdown'] },
    { key: 'kb.review.form', version: 1, targets: ['react'] },
  ],
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'notifications', version: 1 },
      { key: 'audit-trail', version: 1 },
    ],
  },
};

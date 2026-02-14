import { defineFeature } from '@contractspec/lib.contracts-spec';

export const KbUpdatePipelineFeature = defineFeature({
  meta: {
    key: 'kb-update-pipeline',
    version: '1.0.0',
    title: 'KB Update Pipeline (HITL)',
    description:
      'Automation proposes KB patches; humans verify; publishing is blocked until approvals are complete.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['knowledge', 'pipeline', 'hitl', 'audit', 'notifications'],
    stability: 'experimental',
  },
  operations: [
    { key: 'kbPipeline.runWatch', version: '1.0.0' },
    { key: 'kbPipeline.createReviewTask', version: '1.0.0' },
    { key: 'kbPipeline.submitDecision', version: '1.0.0' },
    { key: 'kbPipeline.publishIfReady', version: '1.0.0' },
  ],
  events: [
    { key: 'kb.change.detected', version: '1.0.0' },
    { key: 'kb.change.summarized', version: '1.0.0' },
    { key: 'kb.patch.proposed', version: '1.0.0' },
    { key: 'kb.review.requested', version: '1.0.0' },
    { key: 'kb.review.decided', version: '1.0.0' },
  ],
  presentations: [
    { key: 'kb.dashboard', version: '1.0.0' },
    { key: 'kb.review.list', version: '1.0.0' },
    { key: 'kb.review.form', version: '1.0.0' },
  ],
  opToPresentation: [
    {
      op: { key: 'kbPipeline.runWatch', version: '1.0.0' },
      pres: { key: 'kb.dashboard', version: '1.0.0' },
    },
    {
      op: { key: 'kbPipeline.createReviewTask', version: '1.0.0' },
      pres: { key: 'kb.review.list', version: '1.0.0' },
    },
    {
      op: { key: 'kbPipeline.submitDecision', version: '1.0.0' },
      pres: { key: 'kb.review.form', version: '1.0.0' },
    },
  ],
  presentationsTargets: [
    { key: 'kb.dashboard', version: '1.0.0', targets: ['react', 'markdown'] },
    { key: 'kb.review.list', version: '1.0.0', targets: ['react', 'markdown'] },
    { key: 'kb.review.form', version: '1.0.0', targets: ['react'] },
  ],
  capabilities: {
    requires: [
      { key: 'identity', version: '1.0.0' },
      { key: 'notifications', version: '1.0.0' },
      { key: 'audit-trail', version: '1.0.0' },
    ],
  },
});

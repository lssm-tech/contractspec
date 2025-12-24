import type { FeatureModuleSpec } from '@lssm/lib.contracts';

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
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'notifications', version: 1 },
      { key: 'audit-trail', version: 1 },
    ],
  },
};

import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const KbUpdatePipelineFeature: FeatureModuleSpec = {
  meta: {
    key: 'kb-update-pipeline',
    title: 'KB Update Pipeline (HITL)',
    description:
      'Automation proposes KB patches; humans verify; publishing is blocked until approvals are complete.',
    domain: 'knowledge',
    owners: ['examples'],
    tags: ['knowledge', 'pipeline', 'hitl', 'audit', 'notifications'],
    stability: 'experimental',
  },
  operations: [
    { name: 'kbPipeline.runWatch', version: 1 },
    { name: 'kbPipeline.createReviewTask', version: 1 },
    { name: 'kbPipeline.submitDecision', version: 1 },
    { name: 'kbPipeline.publishIfReady', version: 1 },
  ],
  events: [
    { name: 'kb.change.detected', version: 1 },
    { name: 'kb.change.summarized', version: 1 },
    { name: 'kb.patch.proposed', version: 1 },
    { name: 'kb.review.requested', version: 1 },
    { name: 'kb.review.decided', version: 1 },
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

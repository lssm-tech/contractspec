import { describe, expect, it } from 'bun:test';

import {
  createPipelineMemoryHandlers,
  createPipelineMemoryStore,
} from './memory.handlers';

describe('@lssm/example.kb-update-pipeline memory handlers', () => {
  it('high-risk change cannot be approved by curator role', async () => {
    const store = createPipelineMemoryStore();
    const pipeline = createPipelineMemoryHandlers(store);

    store.candidates.set('c1', {
      id: 'c1',
      sourceDocumentId: 'EU_src1',
      detectedAt: new Date(),
      diffSummary: 'Change detected',
      riskLevel: 'high',
    });

    const review = await pipeline.createReviewTask({ changeCandidateId: 'c1' });
    await expect(
      pipeline.submitDecision({
        reviewTaskId: review.id,
        decision: 'approve',
        decidedBy: 'u_curator',
        decidedByRole: 'curator',
      })
    ).rejects.toThrow('FORBIDDEN_ROLE');
  });

  it('fires a notification when review is requested', async () => {
    const store = createPipelineMemoryStore();
    const pipeline = createPipelineMemoryHandlers(store);

    store.candidates.set('c2', {
      id: 'c2',
      sourceDocumentId: 'EU_src2',
      detectedAt: new Date(),
      diffSummary: 'Minor change',
      riskLevel: 'low',
    });

    const review = await pipeline.createReviewTask({ changeCandidateId: 'c2' });
    expect(store.notifications.length).toBe(1);
    expect(store.notifications[0]?.reviewTaskId).toBe(review.id);
    expect(store.notifications[0]?.assignedRole).toBe('curator');
  });

  it('publishing fails if any included rule versions are not approved', async () => {
    const store = createPipelineMemoryStore();
    const pipeline = createPipelineMemoryHandlers(store);

    store.candidates.set('c3', {
      id: 'c3',
      sourceDocumentId: 'EU_src3',
      detectedAt: new Date(),
      diffSummary: 'Change',
      riskLevel: 'low',
    });

    const review = await pipeline.createReviewTask({ changeCandidateId: 'c3' });
    await pipeline.proposeRulePatch({
      changeCandidateId: 'c3',
      proposedRuleVersionIds: ['rv1', 'rv2'],
    });
    await pipeline.submitDecision({
      reviewTaskId: review.id,
      decision: 'approve',
      decidedBy: 'u_curator',
      decidedByRole: 'curator',
    });

    // only approve one of the proposed rule versions
    await pipeline.markRuleVersionApproved({ ruleVersionId: 'rv1' });

    await expect(
      pipeline.publishIfReady({ jurisdiction: 'EU' })
    ).rejects.toThrow('NOT_READY');
  });
});




import { describe, expect, it } from 'bun:test';

import { LocalRuntimeServices } from '../../infrastructure/runtime-local-web';
import { createPolicySafeKnowledgeAssistantHandlers } from '../../infrastructure/runtime-local-web/handlers/policy-safe-knowledge-assistant.handlers';

describe('policy-safe-knowledge-assistant template flow (runtime-local)', () => {
  it('publishes a new snapshot and the assistant cites it', async () => {
    const runtime = new LocalRuntimeServices();
    await runtime.init();

    const projectId = 'psa_test_project';
    await runtime.seedTemplate({
      templateId: 'policy-safe-knowledge-assistant',
      projectId,
    });

    const handlers = createPolicySafeKnowledgeAssistantHandlers(runtime.db);
    const ctx1 = await handlers.getUserContext({ projectId });
    expect(ctx1.kbSnapshotId).toBeTruthy();

    const a1 = await handlers.answer({
      projectId,
      question: 'reporting obligations',
    });
    expect(a1.refused).not.toBeTrue();
    expect(a1.citations[0]?.kbSnapshotId).toBe(ctx1.kbSnapshotId);

    // Create new rule version for the seeded rule and approve it
    const rv = await handlers.upsertRuleVersion({
      projectId,
      ruleId: 'psa_rule_eu_tax',
      content: 'EU: Reporting obligations v2 (updated)',
      sourceRefs: [{ sourceDocumentId: 'src_eu_seed_v2', excerpt: 'seed v2 excerpt' }],
    });
    await handlers.approveRuleVersion({ ruleVersionId: rv.id, approver: 'demo_expert' });

    // HITL pipeline: high-risk change requires expert
    const cand = await handlers.createChangeCandidate({
      projectId,
      jurisdiction: 'EU',
      diffSummary: 'Simulated change',
      riskLevel: 'high',
      proposedRuleVersionIds: [rv.id],
    });
    const review = await handlers.createReviewTask({ changeCandidateId: cand.id });
    expect(review.assignedRole).toBe('expert');
    await handlers.submitDecision({
      reviewTaskId: review.id,
      decision: 'approve',
      decidedByRole: 'expert',
      decidedBy: 'demo_expert',
    });
    await handlers.publishIfReady({ jurisdiction: 'EU' });

    const snap2 = await handlers.publishSnapshot({
      projectId,
      jurisdiction: 'EU',
      asOfDate: new Date('2026-02-01T00:00:00.000Z'),
    });
    expect(snap2.id).toBeTruthy();

    const ctx2 = await handlers.getUserContext({ projectId });
    expect(ctx2.kbSnapshotId).toBe(snap2.id);

    const a2 = await handlers.answer({ projectId, question: 'updated obligations' });
    expect(a2.refused).not.toBeTrue();
    expect(a2.citations[0]?.kbSnapshotId).toBe(snap2.id);
  });
});






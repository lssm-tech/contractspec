import { describe, expect, it } from 'bun:test';

import {
  createMemoryKbHandlers,
  createMemoryKbStore,
} from '@contractspec/example.versioned-knowledge-base/handlers/memory.handlers';
import {
  createPipelineMemoryHandlers,
  createPipelineMemoryStore,
} from '@contractspec/example.kb-update-pipeline/handlers/memory.handlers';

import { buildPolicySafeAnswer } from './orchestrator/buildAnswer';
import { DEMO_FIXTURES } from './seed/fixtures';

describe('@contractspec/example.policy-safe-knowledge-assistant integration', () => {
  it('answers cite latest snapshot; after pipeline change + publish, answers cite new snapshot', async () => {
    const kbStore = createMemoryKbStore();
    const kb = createMemoryKbHandlers(kbStore);

    const pipelineStore = createPipelineMemoryStore();
    const pipeline = createPipelineMemoryHandlers(pipelineStore);

    // Seed rules
    await kb.createRule(DEMO_FIXTURES.rules.EU_RULE_TAX);

    // Publish initial snapshot (EU v1)
    const rv1 = await kb.upsertRuleVersion({
      ruleId: DEMO_FIXTURES.rules.EU_RULE_TAX.id,
      content: 'EU: Reporting obligations v1',
      sourceRefs: [{ sourceDocumentId: 'src_eu_v1', excerpt: 'v1 excerpt' }],
    });
    await kb.approveRuleVersion({
      ruleVersionId: rv1.id,
      approver: 'expert_1',
    });
    const snap1 = await kb.publishSnapshot({
      jurisdiction: 'EU',
      asOfDate: new Date('2026-01-01T00:00:00.000Z'),
    });

    const envelopeBase = {
      traceId: 'trace_1',
      locale: 'en-GB',
      regulatoryContext: { jurisdiction: 'EU' },
      allowedScope: 'education_only' as const,
    };

    const a1 = await buildPolicySafeAnswer({
      envelope: { ...envelopeBase, kbSnapshotId: snap1.id },
      question: 'reporting obligations',
      kbSearch: kb.search,
    });

    expect(a1.refused).not.toBeTrue();
    expect(a1.citations.length).toBeGreaterThan(0);
    expect(a1.citations[0]?.kbSnapshotId).toBe(snap1.id);

    // Simulate regulatory change via pipeline: create candidate, review, propose patch
    pipelineStore.candidates.set('cand_1', {
      id: 'cand_1',
      sourceDocumentId: 'EU_src_change',
      detectedAt: new Date('2026-02-01T00:00:00.000Z'),
      diffSummary: 'Updated obligations',
      riskLevel: 'high',
    });
    const review = await pipeline.createReviewTask({
      changeCandidateId: 'cand_1',
    });
    await pipeline.submitDecision({
      reviewTaskId: review.id,
      decision: 'approve',
      decidedBy: 'expert_2',
      decidedByRole: 'expert',
    });

    // Create + approve new KB rule version
    const rv2 = await kb.upsertRuleVersion({
      ruleId: DEMO_FIXTURES.rules.EU_RULE_TAX.id,
      content: 'EU: Reporting obligations v2 (updated)',
      sourceRefs: [{ sourceDocumentId: 'src_eu_v2', excerpt: 'v2 excerpt' }],
    });
    await kb.approveRuleVersion({
      ruleVersionId: rv2.id,
      approver: 'expert_2',
    });

    // Link pipeline proposal to the actual KB rule version id, then mark it approved
    await pipeline.proposeRulePatch({
      changeCandidateId: 'cand_1',
      proposedRuleVersionIds: [rv2.id],
    });
    await pipeline.markRuleVersionApproved({ ruleVersionId: rv2.id });
    await pipeline.publishIfReady({ jurisdiction: 'EU' });

    const snap2 = await kb.publishSnapshot({
      jurisdiction: 'EU',
      asOfDate: new Date('2026-02-01T00:00:00.000Z'),
    });

    const a2 = await buildPolicySafeAnswer({
      envelope: { ...envelopeBase, kbSnapshotId: snap2.id },
      question: 'updated obligations',
      kbSearch: kb.search,
    });
    expect(a2.refused).not.toBeTrue();
    expect(a2.citations[0]?.kbSnapshotId).toBe(snap2.id);
  });
});

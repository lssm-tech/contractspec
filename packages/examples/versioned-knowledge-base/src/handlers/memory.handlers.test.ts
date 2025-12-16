import { describe, expect, it } from 'bun:test';

import { createMemoryKbHandlers, createMemoryKbStore } from './memory.handlers';

describe('@contractspec/example.versioned-knowledge-base memory handlers', () => {
  it('requires sourceRefs for rule versions (traceability)', async () => {
    const store = createMemoryKbStore();
    const kb = createMemoryKbHandlers(store);
    await kb.createRule({ id: 'rule_1', jurisdiction: 'EU', topicKey: 't1' });
    await expect(
      kb.upsertRuleVersion({ ruleId: 'rule_1', content: 'x', sourceRefs: [] })
    ).rejects.toThrow('SOURCE_REFS_REQUIRED');
  });

  it('snapshot includes only approved rule versions for that jurisdiction', async () => {
    const store = createMemoryKbStore();
    const kb = createMemoryKbHandlers(store);

    await kb.createRule({ id: 'rule_eu', jurisdiction: 'EU', topicKey: 'tax' });
    await kb.createRule({ id: 'rule_fr', jurisdiction: 'FR', topicKey: 'tax' });

    const euDraft = await kb.upsertRuleVersion({
      ruleId: 'rule_eu',
      content: 'EU rule content',
      sourceRefs: [{ sourceDocumentId: 'src1' }],
    });
    const frDraft = await kb.upsertRuleVersion({
      ruleId: 'rule_fr',
      content: 'FR rule content',
      sourceRefs: [{ sourceDocumentId: 'src2' }],
    });

    const euApproved = await kb.approveRuleVersion({
      ruleVersionId: euDraft.id,
      approver: 'expert_1',
    });
    await kb.approveRuleVersion({
      ruleVersionId: frDraft.id,
      approver: 'expert_1',
    });

    const snapshot = await kb.publishSnapshot({
      jurisdiction: 'EU',
      asOfDate: new Date('2026-01-01T00:00:00.000Z'),
    });

    expect(snapshot.includedRuleVersionIds).toEqual([euApproved.id]);
  });

  it('search is scoped to snapshot + jurisdiction', async () => {
    const store = createMemoryKbStore();
    const kb = createMemoryKbHandlers(store);

    await kb.createRule({
      id: 'rule_eu',
      jurisdiction: 'EU',
      topicKey: 'topic',
    });
    const euDraft = await kb.upsertRuleVersion({
      ruleId: 'rule_eu',
      content: 'This is about reporting obligations',
      sourceRefs: [{ sourceDocumentId: 'src1' }],
    });
    await kb.approveRuleVersion({ ruleVersionId: euDraft.id, approver: 'u1' });
    const snap = await kb.publishSnapshot({
      jurisdiction: 'EU',
      asOfDate: new Date('2026-01-01T00:00:00.000Z'),
    });

    await expect(
      kb.search({ snapshotId: snap.id, jurisdiction: 'FR', query: 'reporting' })
    ).rejects.toThrow('JURISDICTION_MISMATCH');

    const ok = await kb.search({
      snapshotId: snap.id,
      jurisdiction: 'EU',
      query: 'reporting',
    });
    expect(ok.items.map((i) => i.ruleVersionId)).toEqual([euDraft.id]);
  });
});





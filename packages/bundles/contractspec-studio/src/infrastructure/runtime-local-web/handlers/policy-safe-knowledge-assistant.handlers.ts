/**
 * Runtime-local handlers for the Policy-safe Knowledge Assistant template.
 *
 * These handlers are intentionally minimal and deterministic:
 * - No external LLM calls
 * - No web fetching as primary truth
 * - Answers are derived from KB snapshots and must include citations
 */
import type { LocalDatabase } from '../database/sqlite-wasm';
import { generateId } from '../utils/id';

import { buildPolicySafeAnswer } from '@lssm/example.policy-safe-knowledge-assistant/orchestrator/buildAnswer';

type AllowedScope = 'education_only' | 'generic_info' | 'escalation_required';
type RiskLevel = 'low' | 'medium' | 'high';
type ReviewRole = 'curator' | 'expert';

interface UserContextRow extends Record<string, unknown> {
  projectId: string;
  locale: string;
  jurisdiction: string;
  allowedScope: AllowedScope;
  kbSnapshotId: string | null;
}

interface RuleRow extends Record<string, unknown> {
  id: string;
  projectId: string;
  jurisdiction: string;
  topicKey: string;
}

interface RuleVersionRow extends Record<string, unknown> {
  id: string;
  ruleId: string;
  jurisdiction: string;
  topicKey: string;
  version: number;
  content: string;
  status: string;
  sourceRefsJson: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
}

interface SnapshotRow extends Record<string, unknown> {
  id: string;
  jurisdiction: string;
  asOfDate: string;
  includedRuleVersionIdsJson: string;
  publishedAt: string;
}

interface ChangeCandidateRow extends Record<string, unknown> {
  id: string;
  projectId: string;
  jurisdiction: string;
  detectedAt: string;
  diffSummary: string;
  riskLevel: RiskLevel;
  proposedRuleVersionIdsJson: string;
}

interface ReviewTaskRow extends Record<string, unknown> {
  id: string;
  changeCandidateId: string;
  status: string;
  assignedRole: ReviewRole;
  decision: string | null;
  decidedAt: string | null;
  decidedBy: string | null;
}

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

export function createPolicySafeKnowledgeAssistantHandlers(db: LocalDatabase) {
  async function getUserContext(input: { projectId: string }) {
    const rows = await db.exec(
      `SELECT * FROM psa_user_context WHERE projectId = ? LIMIT 1`,
      [input.projectId]
    );
    const row = rows[0] as UserContextRow | undefined;
    if (!row) {
      return {
        projectId: input.projectId,
        locale: 'en-GB',
        jurisdiction: 'EU',
        allowedScope: 'education_only' as const,
        kbSnapshotId: null as string | null,
      };
    }
    return {
      projectId: row.projectId,
      locale: row.locale,
      jurisdiction: row.jurisdiction,
      allowedScope: row.allowedScope,
      kbSnapshotId: row.kbSnapshotId,
    };
  }

  async function setUserContext(input: {
    projectId: string;
    locale: string;
    jurisdiction: string;
    allowedScope: AllowedScope;
  }) {
    const existing = await db.exec(
      `SELECT projectId FROM psa_user_context WHERE projectId = ? LIMIT 1`,
      [input.projectId]
    );
    if (existing.length) {
      await db.run(
        `UPDATE psa_user_context SET locale = ?, jurisdiction = ?, allowedScope = ? WHERE projectId = ?`,
        [input.locale, input.jurisdiction, input.allowedScope, input.projectId]
      );
    } else {
      await db.run(
        `INSERT INTO psa_user_context (projectId, locale, jurisdiction, allowedScope, kbSnapshotId) VALUES (?, ?, ?, ?, ?)`,
        [input.projectId, input.locale, input.jurisdiction, input.allowedScope, null]
      );
    }
    return await getUserContext({ projectId: input.projectId });
  }

  async function createRule(input: {
    projectId: string;
    jurisdiction: string;
    topicKey: string;
  }) {
    const id = generateId('psa_rule');
    await db.run(
      `INSERT INTO psa_rule (id, projectId, jurisdiction, topicKey) VALUES (?, ?, ?, ?)`,
      [id, input.projectId, input.jurisdiction, input.topicKey]
    );
    return { id, ...input };
  }

  async function upsertRuleVersion(input: {
    projectId: string;
    ruleId: string;
    content: string;
    sourceRefs: Array<{ sourceDocumentId: string; excerpt?: string }>;
  }) {
    if (!input.sourceRefs.length) throw new Error('SOURCE_REFS_REQUIRED');
    const rules = await db.exec(`SELECT * FROM psa_rule WHERE id = ? LIMIT 1`, [
      input.ruleId,
    ]);
    const rule = rules[0] as RuleRow | undefined;
    if (!rule) throw new Error('RULE_NOT_FOUND');

    const maxRows = await db.exec(
      `SELECT MAX(version) as maxVersion FROM psa_rule_version WHERE ruleId = ?`,
      [input.ruleId]
    );
    const maxVersion = Number((maxRows[0] as Record<string, unknown>)?.maxVersion ?? 0);
    const version = maxVersion + 1;
    const id = generateId('psa_rv');
    const createdAt = nowIso();
    await db.run(
      `INSERT INTO psa_rule_version (id, ruleId, jurisdiction, topicKey, version, content, status, sourceRefsJson, approvedBy, approvedAt, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.ruleId,
        rule.jurisdiction,
        rule.topicKey,
        version,
        input.content,
        'draft',
        JSON.stringify(input.sourceRefs),
        null,
        null,
        createdAt,
      ]
    );
    return {
      id,
      ruleId: input.ruleId,
      jurisdiction: rule.jurisdiction,
      topicKey: rule.topicKey,
      version,
      content: input.content,
      status: 'draft',
      sourceRefs: input.sourceRefs,
      createdAt: new Date(createdAt),
    };
  }

  async function approveRuleVersion(input: {
    ruleVersionId: string;
    approver: string;
  }) {
    const approvedAt = nowIso();
    await db.run(
      `UPDATE psa_rule_version SET status = ?, approvedBy = ?, approvedAt = ? WHERE id = ?`,
      ['approved', input.approver, approvedAt, input.ruleVersionId]
    );
    return { ruleVersionId: input.ruleVersionId, status: 'approved' as const };
  }

  async function publishSnapshot(input: {
    projectId: string;
    jurisdiction: string;
    asOfDate: Date;
  }) {
    const approved = await db.exec(
      `SELECT id FROM psa_rule_version WHERE jurisdiction = ? AND status = 'approved' ORDER BY id ASC`,
      [input.jurisdiction]
    );
    const includedIds = approved
      .map((r) => (r as { id: string }).id)
      .filter(Boolean);
    if (!includedIds.length) throw new Error('NO_APPROVED_RULES');
    const id = generateId('psa_snap');
    const publishedAt = nowIso();
    await db.run(
      `INSERT INTO psa_snapshot (id, jurisdiction, asOfDate, includedRuleVersionIdsJson, publishedAt)
       VALUES (?, ?, ?, ?, ?)`,
      [id, input.jurisdiction, input.asOfDate.toISOString(), JSON.stringify(includedIds), publishedAt]
    );
    // update user context snapshot pointer (single-profile demo)
    await db.run(
      `UPDATE psa_user_context SET kbSnapshotId = ? WHERE projectId = ?`,
      [id, input.projectId]
    );
    return { id, jurisdiction: input.jurisdiction, includedRuleVersionIds: includedIds };
  }

  async function searchKb(input: {
    snapshotId: string;
    jurisdiction: string;
    query: string;
  }) {
    const snapRows = await db.exec(`SELECT * FROM psa_snapshot WHERE id = ? LIMIT 1`, [
      input.snapshotId,
    ]);
    const snap = snapRows[0] as SnapshotRow | undefined;
    if (!snap) throw new Error('SNAPSHOT_NOT_FOUND');
    if (snap.jurisdiction !== input.jurisdiction) throw new Error('JURISDICTION_MISMATCH');

    const includedIds = parseJsonArray(snap.includedRuleVersionIdsJson);
    const tokens = input.query
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const items: Array<{ ruleVersionId: string; excerpt?: string }> = [];
    for (const id of includedIds) {
      const rows = await db.exec(
        `SELECT * FROM psa_rule_version WHERE id = ? LIMIT 1`,
        [id]
      );
      const rv = rows[0] as RuleVersionRow | undefined;
      if (!rv) continue;
      const hay = rv.content.toLowerCase();
      const match = tokens.length ? tokens.every((t) => hay.includes(t)) : true;
      if (!match) continue;
      items.push({ ruleVersionId: rv.id, excerpt: rv.content.slice(0, 140) });
    }
    return { items };
  }

  async function answer(input: { projectId: string; question: string }) {
    const ctx = await getUserContext({ projectId: input.projectId });
    if (!ctx.kbSnapshotId) {
      // fail closed: no snapshot id => refuse via gate
      const refused = await buildPolicySafeAnswer({
        envelope: {
          traceId: generateId('trace'),
          locale: ctx.locale,
          kbSnapshotId: '',
          allowedScope: ctx.allowedScope,
          regulatoryContext: { jurisdiction: ctx.jurisdiction },
        },
        question: input.question,
        kbSearch: async () => ({ items: [] }),
      });
      return refused;
    }
    return await buildPolicySafeAnswer({
      envelope: {
        traceId: generateId('trace'),
        locale: ctx.locale,
        kbSnapshotId: ctx.kbSnapshotId,
        allowedScope: ctx.allowedScope,
        regulatoryContext: { jurisdiction: ctx.jurisdiction },
      },
      question: input.question,
      kbSearch: async (q) => await searchKb(q),
    });
  }

  async function createChangeCandidate(input: {
    projectId: string;
    jurisdiction: string;
    diffSummary: string;
    riskLevel: RiskLevel;
    proposedRuleVersionIds: string[];
  }) {
    const id = generateId('psa_change');
    await db.run(
      `INSERT INTO psa_change_candidate (id, projectId, jurisdiction, detectedAt, diffSummary, riskLevel, proposedRuleVersionIdsJson)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.projectId,
        input.jurisdiction,
        nowIso(),
        input.diffSummary,
        input.riskLevel,
        JSON.stringify(input.proposedRuleVersionIds),
      ]
    );
    return { id };
  }

  async function createReviewTask(input: { changeCandidateId: string }) {
    const rows = await db.exec(
      `SELECT * FROM psa_change_candidate WHERE id = ? LIMIT 1`,
      [input.changeCandidateId]
    );
    const candidate = rows[0] as ChangeCandidateRow | undefined;
    if (!candidate) throw new Error('CHANGE_CANDIDATE_NOT_FOUND');
    const assignedRole: ReviewRole = candidate.riskLevel === 'high' ? 'expert' : 'curator';
    const id = generateId('psa_review');
    await db.run(
      `INSERT INTO psa_review_task (id, changeCandidateId, status, assignedRole, decision, decidedAt, decidedBy)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, input.changeCandidateId, 'open', assignedRole, null, null, null]
    );
    return { id, assignedRole };
  }

  async function submitDecision(input: {
    reviewTaskId: string;
    decision: 'approve' | 'reject';
    decidedByRole: ReviewRole;
    decidedBy: string;
  }) {
    const reviewRows = await db.exec(
      `SELECT * FROM psa_review_task WHERE id = ? LIMIT 1`,
      [input.reviewTaskId]
    );
    const task = reviewRows[0] as ReviewTaskRow | undefined;
    if (!task) throw new Error('REVIEW_TASK_NOT_FOUND');

    const candidateRows = await db.exec(
      `SELECT * FROM psa_change_candidate WHERE id = ? LIMIT 1`,
      [task.changeCandidateId]
    );
    const candidate = candidateRows[0] as ChangeCandidateRow | undefined;
    if (!candidate) throw new Error('CHANGE_CANDIDATE_NOT_FOUND');
    if (candidate.riskLevel === 'high' && input.decision === 'approve' && input.decidedByRole !== 'expert') {
      throw new Error('FORBIDDEN_ROLE');
    }

    const decidedAt = nowIso();
    await db.run(
      `UPDATE psa_review_task SET status = ?, decision = ?, decidedAt = ?, decidedBy = ? WHERE id = ?`,
      ['decided', input.decision, decidedAt, input.decidedBy, input.reviewTaskId]
    );
    return { id: input.reviewTaskId, status: 'decided' as const };
  }

  async function publishIfReady(input: { jurisdiction: string }) {
    const open = await db.exec(
      `SELECT COUNT(*) as count FROM psa_review_task WHERE status != 'decided'`,
      []
    );
    const openCount = Number((open[0] as Record<string, unknown>)?.count ?? 0);
    if (openCount > 0) throw new Error('NOT_READY');

    // Ensure for each approved review, all proposed rule versions are approved in KB.
    const decided = await db.exec(`SELECT * FROM psa_review_task`, []);
    for (const row of decided as ReviewTaskRow[]) {
      if (row.decision !== 'approve') continue;
      const candRows = await db.exec(
        `SELECT * FROM psa_change_candidate WHERE id = ? LIMIT 1`,
        [row.changeCandidateId]
      );
      const cand = candRows[0] as ChangeCandidateRow | undefined;
      if (!cand) continue;
      if (cand.jurisdiction !== input.jurisdiction) continue;
      const proposedIds = parseJsonArray(cand.proposedRuleVersionIdsJson);
      for (const rvId of proposedIds) {
        const rvRows = await db.exec(
          `SELECT status FROM psa_rule_version WHERE id = ? LIMIT 1`,
          [rvId]
        );
        const status = String((rvRows[0] as Record<string, unknown> | undefined)?.status ?? '');
        if (status !== 'approved') throw new Error('NOT_READY');
      }
    }
    return { published: true as const };
  }

  return {
    // Onboarding
    getUserContext,
    setUserContext,

    // KB
    createRule,
    upsertRuleVersion,
    approveRuleVersion,
    publishSnapshot,
    searchKb,

    // Assistant
    answer,

    // Pipeline
    createChangeCandidate,
    createReviewTask,
    submitDecision,
    publishIfReady,
  };
}










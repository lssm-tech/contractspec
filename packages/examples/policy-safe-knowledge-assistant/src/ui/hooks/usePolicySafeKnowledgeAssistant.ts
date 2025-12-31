'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';

type AllowedScope = 'education_only' | 'generic_info' | 'escalation_required';
type RiskLevel = 'low' | 'medium' | 'high';

export interface UsePolicySafeKnowledgeAssistantState {
  context: {
    locale: string;
    jurisdiction: string;
    allowedScope: AllowedScope;
    kbSnapshotId: string | null;
  } | null;
  loading: boolean;
  error: Error | null;
  lastAnswer: {
    refused?: boolean;
    refusalReason?: string;
    sections: { heading: string; body: string }[];
    citations: {
      kbSnapshotId: string;
      sourceId: string;
      excerpt?: string;
    }[];
  } | null;
  lastRuleId: string | null;
  lastRuleVersionId: string | null;
  lastSnapshotId: string | null;
  lastReviewTaskId: string | null;
}

interface CitationLike {
  kbSnapshotId: string;
  sourceId: string;
  excerpt?: string;
}
interface AnswerLike {
  refused?: boolean;
  refusalReason?: string;
  sections: { heading: string; body: string }[];
  citations: CitationLike[];
}

function isCitationLike(value: unknown): value is CitationLike {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.kbSnapshotId === 'string' && typeof v.sourceId === 'string';
}

function toCitations(value: unknown): CitationLike[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isCitationLike).map((c) => ({
    kbSnapshotId: c.kbSnapshotId,
    sourceId: c.sourceId,
    excerpt: c.excerpt,
  }));
}

export function usePolicySafeKnowledgeAssistant() {
  const { handlers, projectId } = useTemplateRuntime();
  const api = handlers.policySafeKnowledgeAssistant;

  const [state, setState] = useState<UsePolicySafeKnowledgeAssistantState>({
    context: null,
    loading: true,
    error: null,
    lastAnswer: null,
    lastRuleId: null,
    lastRuleVersionId: null,
    lastSnapshotId: null,
    lastReviewTaskId: null,
  });

  const refreshContext = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const ctx = await api.getUserContext({ projectId });
      setState((s) => ({
        ...s,
        context: {
          locale: ctx.locale,
          jurisdiction: ctx.jurisdiction,
          allowedScope: ctx.allowedScope,
          kbSnapshotId: ctx.kbSnapshotId,
        },
        loading: false,
      }));
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e : new Error('Unknown error'),
      }));
    }
  }, [api, projectId]);

  useEffect(() => {
    refreshContext();
  }, [refreshContext]);

  const setContext = useCallback(
    async (input: {
      locale: string;
      jurisdiction: string;
      allowedScope: AllowedScope;
    }) => {
      const ctx = await api.setUserContext({ projectId, ...input });
      setState((s) => ({
        ...s,
        context: {
          locale: ctx.locale,
          jurisdiction: ctx.jurisdiction,
          allowedScope: ctx.allowedScope,
          kbSnapshotId: ctx.kbSnapshotId,
        },
      }));
    },
    [api, projectId]
  );

  const askAssistant = useCallback(
    async (question: string) => {
      const answerUnknown: unknown = await api.answer({ projectId, question });
      const answer = answerUnknown as AnswerLike;
      setState((s) => ({
        ...s,
        lastAnswer: {
          refused: answer.refused,
          refusalReason: answer.refusalReason,
          sections: answer.sections,
          citations: toCitations(
            (answerUnknown as { citations?: unknown }).citations
          ),
        },
      }));
    },
    [api, projectId]
  );

  const createDemoRule = useCallback(async () => {
    const rule = await api.createRule({
      projectId,
      jurisdiction: state.context?.jurisdiction ?? 'EU',
      topicKey: 'tax_reporting',
    });
    setState((s) => ({ ...s, lastRuleId: rule.id }));
    return rule.id as string;
  }, [api, projectId, state.context?.jurisdiction]);

  const upsertRuleVersion = useCallback(
    async (input: { ruleId: string; content: string }) => {
      const rv = await api.upsertRuleVersion({
        projectId,
        ruleId: input.ruleId,
        content: input.content,
        sourceRefs: [{ sourceDocumentId: 'src_demo', excerpt: 'demo excerpt' }],
      });
      setState((s) => ({ ...s, lastRuleVersionId: rv.id }));
      return rv.id as string;
    },
    [api, projectId]
  );

  const approveRuleVersion = useCallback(
    async (ruleVersionId: string) => {
      await api.approveRuleVersion({ ruleVersionId, approver: 'demo_expert' });
    },
    [api]
  );

  const publishSnapshot = useCallback(async () => {
    const snap = await api.publishSnapshot({
      projectId,
      jurisdiction: state.context?.jurisdiction ?? 'EU',
      asOfDate: new Date('2026-02-01T00:00:00.000Z'),
    });
    setState((s) => ({ ...s, lastSnapshotId: snap.id }));
    await refreshContext();
    return snap.id as string;
  }, [api, projectId, refreshContext, state.context?.jurisdiction]);

  const simulateHighRiskChangeAndApprove = useCallback(
    async (ruleVersionId: string) => {
      const cand = await api.createChangeCandidate({
        projectId,
        jurisdiction: state.context?.jurisdiction ?? 'EU',
        diffSummary: 'Simulated change (demo)',
        riskLevel: 'high' satisfies RiskLevel,
        proposedRuleVersionIds: [ruleVersionId],
      });
      const review = await api.createReviewTask({ changeCandidateId: cand.id });
      setState((s) => ({ ...s, lastReviewTaskId: review.id }));
      await api.submitDecision({
        reviewTaskId: review.id,
        decision: 'approve',
        decidedByRole: 'expert',
        decidedBy: 'demo_expert',
      });
      await api.publishIfReady({
        jurisdiction: state.context?.jurisdiction ?? 'EU',
      });
      return review.id as string;
    },
    [api, projectId, state.context?.jurisdiction]
  );

  const derived = useMemo(() => ({ projectId }), [projectId]);

  return {
    state,
    derived,
    actions: {
      refreshContext,
      setContext,
      askAssistant,
      createDemoRule,
      upsertRuleVersion,
      approveRuleVersion,
      publishSnapshot,
      simulateHighRiskChangeAndApprove,
    },
  };
}

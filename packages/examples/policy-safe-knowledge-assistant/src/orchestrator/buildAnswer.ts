import {
  enforceAllowedScope,
  enforceCitations,
  validateEnvelope,
} from '@lssm/example.locale-jurisdiction-gate/policy/guard';

type AllowedScope = 'education_only' | 'generic_info' | 'escalation_required';

export interface AssistantAnswerIR {
  locale: string;
  jurisdiction: string;
  allowedScope: AllowedScope;
  sections: { heading: string; body: string }[];
  citations: {
    kbSnapshotId: string;
    sourceType: string;
    sourceId: string;
    title?: string;
    excerpt?: string;
  }[];
  disclaimers?: string[];
  riskFlags?: string[];
  refused?: boolean;
  refusalReason?: string;
}

export interface BuildAnswerInput {
  envelope: {
    traceId: string;
    locale: string;
    kbSnapshotId: string;
    allowedScope: AllowedScope;
    regulatoryContext: { jurisdiction: string };
  };
  question: string;
  kbSearch: (input: {
    snapshotId: string;
    jurisdiction: string;
    query: string;
  }) => Promise<{ items: { ruleVersionId: string; excerpt?: string }[] }>;
}

/**
 * Build a policy-safe assistant answer derived from KB search results.
 *
 * Deterministic: no LLM calls; if search yields no results, it refuses.
 */
export async function buildPolicySafeAnswer(
  input: BuildAnswerInput
): Promise<AssistantAnswerIR> {
  const env = validateEnvelope(input.envelope);
  if (!env.ok) {
    return {
      locale: input.envelope.locale ?? 'en-GB',
      jurisdiction: input.envelope.regulatoryContext?.jurisdiction ?? 'UNKNOWN',
      allowedScope: input.envelope.allowedScope ?? 'education_only',
      sections: [{ heading: 'Request blocked', body: env.error.message }],
      citations: [],
      disclaimers: ['This system refuses to answer without a valid envelope.'],
      riskFlags: [env.error.code],
      refused: true,
      refusalReason: env.error.code,
    };
  }

  const results = await input.kbSearch({
    snapshotId: env.value.kbSnapshotId,
    jurisdiction: env.value.regulatoryContext!.jurisdiction!,
    query: input.question,
  });

  const citations = results.items.map((item) => ({
    kbSnapshotId: env.value.kbSnapshotId,
    sourceType: 'ruleVersion',
    sourceId: item.ruleVersionId,
    title: 'Curated rule version',
    excerpt: item.excerpt,
  }));

  const draft: AssistantAnswerIR = {
    locale: env.value.locale,
    jurisdiction: env.value.regulatoryContext!.jurisdiction!,
    allowedScope: env.value.allowedScope,
    sections: [
      {
        heading: 'Answer (KB-derived)',
        body:
          results.items.length > 0
            ? `This answer is derived from ${results.items.length} curated rule version(s) in the referenced snapshot.`
            : 'No curated knowledge found in the referenced snapshot.',
      },
    ],
    citations,
    disclaimers: ['Educational demo only.'],
    riskFlags: [],
  };

  const scope = enforceAllowedScope(env.value.allowedScope, draft);
  if (!scope.ok) {
    return {
      ...draft,
      sections: [{ heading: 'Escalation required', body: scope.error.message }],
      refused: true,
      refusalReason: scope.error.code,
      riskFlags: [...(draft.riskFlags ?? []), scope.error.code],
    };
  }

  const cited = enforceCitations(draft);
  if (!cited.ok) {
    return {
      ...draft,
      sections: [{ heading: 'Request blocked', body: cited.error.message }],
      citations: [],
      refused: true,
      refusalReason: cited.error.code,
      riskFlags: [...(draft.riskFlags ?? []), cited.error.code],
    };
  }

  return draft;
}

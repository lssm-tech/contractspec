import {
  enforceAllowedScope,
  enforceCitations,
  validateEnvelope,
} from '../policy/guard';

type AllowedScope = 'education_only' | 'generic_info' | 'escalation_required';

interface AssistantAnswerIR {
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

export interface DemoAssistantHandlers {
  answer(input: {
    envelope: {
      traceId: string;
      locale: string;
      kbSnapshotId: string;
      allowedScope: AllowedScope;
      regulatoryContext: { jurisdiction: string };
    };
    question: string;
  }): Promise<AssistantAnswerIR>;

  explainConcept(input: {
    envelope: {
      traceId: string;
      locale: string;
      kbSnapshotId: string;
      allowedScope: AllowedScope;
      regulatoryContext: { jurisdiction: string };
    };
    conceptKey: string;
  }): Promise<AssistantAnswerIR>;
}

/**
 * Deterministic demo assistant handlers (no LLM).
 *
 * - Validates envelope
 * - Requires citations
 * - Enforces allowedScope (education_only blocks actionable language)
 */
export function createDemoAssistantHandlers(): DemoAssistantHandlers {
  async function answer(input: {
    envelope: DemoAssistantHandlers['answer'] extends (a: infer A) => any
      ? A extends { envelope: infer E }
        ? E
        : never
      : never;
    question: string;
  }): Promise<AssistantAnswerIR> {
    const env = validateEnvelope(input.envelope);
    if (!env.ok) {
      return {
        locale: input.envelope.locale ?? 'en-US',
        jurisdiction:
          input.envelope.regulatoryContext?.jurisdiction ?? 'UNKNOWN',
        allowedScope: input.envelope.allowedScope ?? 'education_only',
        sections: [
          {
            heading: 'Request blocked',
            body: env.error.message,
          },
        ],
        citations: [],
        disclaimers: [
          'This system refuses to answer without a valid envelope.',
        ],
        riskFlags: [env.error.code],
        refused: true,
        refusalReason: env.error.code,
      };
    }

    const draft: AssistantAnswerIR = {
      locale: env.value.locale,
      jurisdiction: env.value.regulatoryContext!.jurisdiction!,
      allowedScope: env.value.allowedScope!,
      sections: [
        {
          heading: 'Answer (demo)',
          body: `You asked: "${input.question}". This demo answer is derived from the KB snapshot only.`,
        },
      ],
      citations: [
        {
          kbSnapshotId: env.value.kbSnapshotId!,
          sourceType: 'ruleVersion',
          sourceId: 'rv_demo',
          title: 'Demo rule version',
          excerpt: 'Demo excerpt',
        },
      ],
      disclaimers: ['Educational demo only.'],
      riskFlags: [],
    };

    const scope = enforceAllowedScope(env.value.allowedScope, draft);
    if (!scope.ok) {
      return {
        ...draft,
        sections: [
          { heading: 'Escalation required', body: scope.error.message },
        ],
        citations: draft.citations,
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

  async function explainConcept(input: {
    envelope: DemoAssistantHandlers['explainConcept'] extends (
      a: infer A
    ) => any
      ? A extends { envelope: infer E }
        ? E
        : never
      : never;
    conceptKey: string;
  }): Promise<AssistantAnswerIR> {
    return await answer({
      envelope: input.envelope,
      question: `Explain concept: ${input.conceptKey}`,
    });
  }

  return { answer, explainConcept };
}

import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const docBlocks: DocBlock[] = [
  {
    id: 'docs.examples.locale-jurisdiction-gate.goal',
    title: 'Locale/Jurisdiction Gate — Goal',
    summary:
      'Fail-closed gate that forces locale + jurisdiction + kbSnapshotId + allowedScope for assistant calls.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/locale-jurisdiction-gate/goal',
    tags: ['assistant', 'policy', 'locale', 'jurisdiction', 'knowledge'],
    body: `## Why it matters
- Forces all assistant behavior to be bound to explicit inputs (no guessing).
- Requires KB snapshot citations to make answers traceable and regenerable.

## Guardrails
- Missing locale/jurisdiction/snapshot/scope => refuse (structured).
- Missing citations => refuse.
- Scope violations under education_only => refuse/escalate.`,
  },
  {
    id: 'docs.examples.locale-jurisdiction-gate.reference',
    title: 'Locale/Jurisdiction Gate — Reference',
    summary: 'Contracts, models, and events exposed by the gate example.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/locale-jurisdiction-gate',
    tags: ['assistant', 'policy', 'reference'],
    body: `## Contracts
- assistant.answer (v1)
- assistant.explainConcept (v1)

## Models
- LLMCallEnvelope (locale, regulatoryContext, kbSnapshotId, allowedScope, traceId)
- AssistantAnswerIR (sections, citations, disclaimers, riskFlags)

## Events
- assistant.answer.requested
- assistant.answer.blocked
- assistant.answer.delivered`,
  },
];

registerDocBlocks(docBlocks);

import { defineFeature } from '@contractspec/lib.contracts';

export const LocaleJurisdictionGateFeature = defineFeature({
  meta: {
    key: 'locale-jurisdiction-gate',
    version: '1.0.0',
    title: 'Locale + Jurisdiction Gate',
    description:
      'Fail-closed gating for assistant calls requiring locale/jurisdiction/snapshot/scope and citations.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['assistant', 'policy', 'locale', 'jurisdiction', 'knowledge'],
    stability: 'experimental',
  },
  operations: [
    { key: 'assistant.answer', version: '1.0.0' },
    { key: 'assistant.explainConcept', version: '1.0.0' },
  ],
  events: [
    { key: 'assistant.answer.requested', version: '1.0.0' },
    { key: 'assistant.answer.blocked', version: '1.0.0' },
    { key: 'assistant.answer.delivered', version: '1.0.0' },
  ],
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],
  capabilities: {
    requires: [{ key: 'knowledge', version: '1.0.0' }],
  },
});

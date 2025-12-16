import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const LocaleJurisdictionGateFeature: FeatureModuleSpec = {
  meta: {
    key: 'locale-jurisdiction-gate',
    title: 'Locale + Jurisdiction Gate',
    description:
      'Fail-closed gating for assistant calls requiring locale/jurisdiction/snapshot/scope and citations.',
    domain: 'knowledge',
    owners: ['examples'],
    tags: ['assistant', 'policy', 'locale', 'jurisdiction', 'knowledge'],
    stability: 'experimental',
  },
  operations: [
    { name: 'assistant.answer', version: 1 },
    { name: 'assistant.explainConcept', version: 1 },
  ],
  events: [
    { name: 'assistant.answer.requested', version: 1 },
    { name: 'assistant.answer.blocked', version: 1 },
    { name: 'assistant.answer.delivered', version: 1 },
  ],
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],
  capabilities: {
    requires: [{ key: 'knowledge', version: 1 }],
  },
};




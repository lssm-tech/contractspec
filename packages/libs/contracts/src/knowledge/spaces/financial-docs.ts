import { StabilityEnum } from '../../ownership';
import type { KnowledgeSpaceRegistry, KnowledgeSpaceSpec } from '../spec';

export const financialDocsKnowledgeSpace: KnowledgeSpaceSpec = {
  meta: {
    key: 'knowledge.financial-docs',
    version: 1,
    category: 'canonical',
    title: 'Household Financial Documents',
    description:
      'Invoices, bills, and contracts powering Pocket Family Office financial automation.',
    domain: 'finance',
    owners: ['platform.finance'],
    tags: ['finance', 'documents'],
    stability: StabilityEnum.Beta,
  },
  retention: {
    ttlDays: null,
  },
  access: {
    policy: { key: 'knowledge.access.financial-docs', version: 1 },
    trustLevel: 'high',
    automationWritable: true,
  },
  indexing: {
    embeddingModel: 'mistral-embed',
    chunkSize: 700,
    vectorDbIntegration: 'vectordb.qdrant',
  },
  description:
    'Normalized financial documents enabling bill pay automation, reminders, and summaries.',
};

export function registerFinancialDocsKnowledgeSpace(
  registry: KnowledgeSpaceRegistry
): KnowledgeSpaceRegistry {
  return registry.register(financialDocsKnowledgeSpace);
}

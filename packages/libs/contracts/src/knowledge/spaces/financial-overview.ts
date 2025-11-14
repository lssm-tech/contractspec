import { StabilityEnum } from '../../ownership';
import type { KnowledgeSpaceRegistry, KnowledgeSpaceSpec } from '../spec';

export const financialOverviewKnowledgeSpace: KnowledgeSpaceSpec = {
  meta: {
    key: 'knowledge.financial-overview',
    version: 1,
    category: 'operational',
    displayName: 'Financial Overview Summaries',
    title: 'Derived Financial Summaries',
    description:
      'Aggregated cashflow summaries, category breakdowns, and balance trends derived from open banking data.',
    domain: 'finance',
    owners: ['platform.finance'],
    tags: ['open-banking', 'summaries', 'cashflow'],
    stability: StabilityEnum.Experimental,
  },
  retention: {
    ttlDays: 180,
  },
  access: {
    policy: { name: 'knowledge.access.financial-overview', version: 1 },
    trustLevel: 'medium',
    automationWritable: true,
  },
  indexing: {
    embeddingModel: 'mistral-embed',
    chunkSize: 600,
    vectorDbIntegration: 'vectordb.qdrant',
  },
  description:
    'Derived knowledge space containing weekly/monthly cashflow rollups and account health summaries. Raw transactions are excluded to respect privacy guardrails.',
};

export function registerFinancialOverviewKnowledgeSpace(
  registry: KnowledgeSpaceRegistry
): KnowledgeSpaceRegistry {
  return registry.register(financialOverviewKnowledgeSpace);
}


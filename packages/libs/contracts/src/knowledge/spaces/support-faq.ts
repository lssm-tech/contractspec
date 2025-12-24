import { StabilityEnum } from '../../ownership';
import type { KnowledgeSpaceRegistry, KnowledgeSpaceSpec } from '../spec';

export const supportFaqKnowledgeSpace: KnowledgeSpaceSpec = {
  meta: {
    key: 'knowledge.support-faq',
    version: 1,
    category: 'operational',
    title: 'Support & Success FAQ',
    description: 'Operational knowledge base for customer support and success.',
    domain: 'support',
    owners: ['platform.support'],
    tags: ['knowledge', 'support'],
    stability: StabilityEnum.Beta,
  },
  retention: {
    ttlDays: 365,
    archiveAfterDays: 180,
  },
  access: {
    policy: { key: 'knowledge.access.support', version: 1 },
    trustLevel: 'medium',
    automationWritable: true,
  },
  indexing: {
    embeddingModel: 'text-embedding-3-small',
    chunkSize: 700,
    vectorDbIntegration: 'vectordb.qdrant',
  },
  description:
    'Operational FAQs, runbooks, and customer success playbooks augmented with automation updates.',
};

export function registerSupportFaqKnowledgeSpace(
  registry: KnowledgeSpaceRegistry
): KnowledgeSpaceRegistry {
  return registry.register(supportFaqKnowledgeSpace);
}

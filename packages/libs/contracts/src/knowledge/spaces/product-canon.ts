import { StabilityEnum } from '../../ownership';
import type { KnowledgeSpaceRegistry, KnowledgeSpaceSpec } from '../spec';

export const productCanonKnowledgeSpace: KnowledgeSpaceSpec = {
  meta: {
    key: 'knowledge.product-canon',
    version: 1,
    category: 'canonical',
    displayName: 'Product Canon',
    title: 'Product Canon Knowledge Space',
    description:
      'Authoritative product knowledge covering strategy, roadmap, and delivery canon.',
    domain: 'product',
    owners: ['platform.product'],
    tags: ['knowledge', 'product'],
    stability: StabilityEnum.Stable,
  },
  retention: {
    ttlDays: null,
  },
  access: {
    policy: { name: 'knowledge.access.product-canon', version: 1 },
    trustLevel: 'high',
    automationWritable: false,
  },
  indexing: {
    embeddingModel: 'text-embedding-3-large',
    chunkSize: 800,
    vectorDbIntegration: 'vectordb.qdrant',
  },
  description:
    'Single source of truth for product canon, principles, and strategic narratives.',
};

export function registerProductCanonKnowledgeSpace(
  registry: KnowledgeSpaceRegistry
): KnowledgeSpaceRegistry {
  return registry.register(productCanonKnowledgeSpace);
}






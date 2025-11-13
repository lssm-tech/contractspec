import { StabilityEnum } from '../../ownership';
import type { KnowledgeSpaceRegistry, KnowledgeSpaceSpec } from '../spec';

export const uploadedDocsKnowledgeSpace: KnowledgeSpaceSpec = {
  meta: {
    key: 'knowledge.uploaded-docs',
    version: 1,
    category: 'external',
    displayName: 'Uploaded Documents',
    title: 'Uploaded Knowledge Assets',
    description:
      'Documents uploaded by households, including invoices, contracts, and reference files.',
    domain: 'operations',
    owners: ['platform.operations'],
    tags: ['documents', 'storage'],
    stability: StabilityEnum.Beta,
  },
  retention: {
    ttlDays: null,
  },
  access: {
    policy: { name: 'knowledge.access.uploaded-docs', version: 1 },
    trustLevel: 'medium',
    automationWritable: true,
  },
  indexing: {
    embeddingModel: 'mistral-embed',
    chunkSize: 900,
    vectorDbIntegration: 'vectordb.qdrant',
  },
  description:
    'User-provided documents normalized and embedded for retrieval augmented workflows.',
};

export function registerUploadedDocsKnowledgeSpace(
  registry: KnowledgeSpaceRegistry
): KnowledgeSpaceRegistry {
  return registry.register(uploadedDocsKnowledgeSpace);
}



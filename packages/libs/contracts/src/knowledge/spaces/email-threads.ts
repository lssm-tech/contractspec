import { StabilityEnum } from '../../ownership';
import type { KnowledgeSpaceRegistry, KnowledgeSpaceSpec } from '../spec';

export const emailThreadsKnowledgeSpace: KnowledgeSpaceSpec = {
  meta: {
    key: 'knowledge.email-threads',
    version: 1,
    category: 'operational',
    displayName: 'Email Threads',
    title: 'Operational Email Threads',
    description:
      'Indexed copies of operational email threads used for support, onboarding, and workflows.',
    domain: 'operations',
    owners: ['platform.operations'],
    tags: ['email', 'operations'],
    stability: StabilityEnum.Beta,
  },
  retention: {
    ttlDays: 365,
  },
  access: {
    policy: { name: 'knowledge.access.email-threads', version: 1 },
    trustLevel: 'medium',
    automationWritable: true,
  },
  indexing: {
    embeddingModel: 'mistral-embed',
    chunkSize: 600,
    vectorDbIntegration: 'vectordb.qdrant',
  },
  description:
    'Operational email threads synchronized from Gmail to support automations and contextual assistance.',
};

export function registerEmailThreadsKnowledgeSpace(
  registry: KnowledgeSpaceRegistry
): KnowledgeSpaceRegistry {
  return registry.register(emailThreadsKnowledgeSpace);
}

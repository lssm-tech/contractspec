import { StabilityEnum } from '../../ownership';
import type { IntegrationSpec, IntegrationSpecRegistry } from '../spec';

export const qdrantIntegrationSpec: IntegrationSpec = {
  meta: {
    key: 'vectordb.qdrant',
    version: 1,
    category: 'vector-db',
    displayName: 'Qdrant',
    title: 'Qdrant Vector Database',
    description: 'Qdrant integration for vector search and embeddings storage.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['vector-db', 'search'],
    stability: StabilityEnum.Experimental,
  },
  capabilities: {
    provides: [
      { key: 'vector-db.search', version: 1 },
      { key: 'vector-db.storage', version: 1 },
    ],
    requires: [
      {
        key: 'ai.embeddings',
        optional: true,
        reason: 'Required if vectors are generated via hosted embedding services',
      },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      required: ['apiUrl'],
      properties: {
        apiUrl: {
          type: 'string',
          description: 'Base URL for the Qdrant instance (e.g., https://qdrant.example.com).',
        },
        apiKey: {
          type: 'string',
          description: 'Optional API key if authentication is enabled.',
        },
        collectionPrefix: {
          type: 'string',
          description: 'Prefix applied to all collection names for this tenant.',
        },
      },
    },
    example: {
      apiUrl: 'https://qdrant.example.com',
      apiKey: 'qdrant-api-key',
      collectionPrefix: 'tenant_',
    },
  },
  healthCheck: {
    method: 'ping',
    timeoutMs: 4000,
  },
  docsUrl: 'https://qdrant.tech/documentation/quick-start/',
  constraints: {
    quotas: {
      collections: 100,
      pointsPerCollection: 1_000_000,
    },
  },
};

export function registerQdrantIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(qdrantIntegrationSpec);
}


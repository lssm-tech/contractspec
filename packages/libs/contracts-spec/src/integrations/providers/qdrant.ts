import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const qdrantIntegrationSpec = defineIntegration({
  meta: {
    key: 'vectordb.qdrant',
    version: '1.0.0',
    category: 'vector-db',
    title: 'Qdrant Vector Database',
    description: 'Qdrant integration for vector search and embeddings storage.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['vector-db', 'search'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [
      { key: 'vector-db.search', version: '1.0.0' },
      { key: 'vector-db.storage', version: '1.0.0' },
    ],
    requires: [
      {
        key: 'ai.embeddings',
        optional: true,
        reason:
          'Required if vectors are generated via hosted embedding services',
      },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        apiUrl: {
          type: 'string',
          description:
            'Base URL for the Qdrant instance (e.g., https://qdrant.example.com).',
        },
        collectionPrefix: {
          type: 'string',
          description:
            'Prefix applied to all collection names for this tenant.',
        },
      },
    },
    example: {
      apiUrl: 'https://qdrant.example.com',
      collectionPrefix: 'tenant_',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      properties: {
        apiKey: {
          type: 'string',
          description: 'API key or token when authentication is enabled.',
        },
      },
    },
    example: {
      apiKey: 'qdrant-api-key',
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
  byokSetup: {
    setupInstructions:
      'Provide the HTTPS endpoint of your Qdrant cluster and generate an API key with read/write access to the collections that will be managed.',
  },
});

export function registerQdrantIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(qdrantIntegrationSpec);
}

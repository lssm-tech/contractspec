import { defineCapability, StabilityEnum } from '@lssm/lib.contracts';

const OWNERS = ['platform.contractspec-studio'] as const;

export const IntegrationHubCapability = defineCapability({
  meta: {
    key: 'studio.integration-hub',
    version: 1,
    kind: 'integration',
    title: 'Studio Integration Hub',
    description:
      'BYOK credential storage, provider onboarding, syncing, and health monitoring for Studio projects.',
    domain: 'integrations',
    owners: [...OWNERS],
    tags: ['integrations', 'byok', 'sync'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      name: 'studio.integration.connect',
      version: 1,
      description:
        'Connect a provider with encrypted credentials and run initial verification.',
    },
    {
      surface: 'operation',
      name: 'studio.integration.disconnect',
      version: 1,
      description: 'Disconnect or disable an integration safely.',
    },
    {
      surface: 'operation',
      name: 'studio.integration.sync',
      version: 1,
      description: 'Trigger a manual synchronization for an integration.',
    },
  ],
  requires: [{ key: 'studio.project', version: 1 }],
});

export const KnowledgeHubCapability = defineCapability({
  meta: {
    key: 'studio.knowledge-hub',
    version: 1,
    kind: 'data',
    title: 'Studio Knowledge Hub',
    description:
      'Knowledge source indexing, embedding generation, and semantic query APIs for Studio agents.',
    domain: 'knowledge',
    owners: [...OWNERS],
    tags: ['knowledge', 'rag', 'ai'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      name: 'studio.knowledge.source.index',
      version: 1,
      description: 'Index or update a knowledge source with embeddings.',
    },
    {
      surface: 'operation',
      name: 'studio.knowledge.query',
      version: 1,
      description: 'Perform semantic queries across indexed knowledge sources.',
    },
  ],
  requires: [
    { key: 'studio.project', version: 1 },
    { key: 'studio.integration-hub', version: 1, optional: true },
  ],
});





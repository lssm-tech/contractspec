import { describe, expect, it, beforeEach } from 'bun:test';
import { IntegrationProvider } from '@contractspec/lib.database-studio';
import { StudioIntegrationModule } from '../../modules/integrations';
import type { CredentialStore } from '../../modules/integrations';
import { prismaMock } from '../mocks/prisma';

const credentialStore: CredentialStore = {
  encrypt: async () => ({ ciphertext: 'encrypted' }),
  decrypt: async () => ({ apiKey: 'plain' }),
};

describe('Integration flow e2e', () => {
  const module = new StudioIntegrationModule({
    credentialStore,
  });

  beforeEach(() => {
    prismaMock.studioIntegration.create.mockReset();
    prismaMock.studioIntegration.update.mockReset();
    prismaMock.studioIntegration.findUniqueOrThrow.mockReset();
  });

  it('connects, syncs, and reads credentials for an integration', async () => {
    prismaMock.studioIntegration.create.mockResolvedValue({
      id: 'integration-1',
      organizationId: 'org-e2e',
      projectId: null,
      provider: IntegrationProvider.OPENAI,
      name: 'OPENAI',
      credentials: {},
      config: null,
      enabled: true,
      usageCount: 0,
      lastUsed: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    prismaMock.studioIntegration.update.mockResolvedValue({
      id: 'integration-1',
      organizationId: 'org-e2e',
      projectId: null,
      provider: IntegrationProvider.OPENAI,
      name: 'OPENAI',
      credentials: {},
      config: null,
      enabled: true,
      usageCount: 1,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    prismaMock.studioIntegration.findUniqueOrThrow.mockResolvedValue({
      id: 'integration-1',
      organizationId: 'org-e2e',
      projectId: null,
      provider: IntegrationProvider.OPENAI,
      name: 'OPENAI',
      credentials: { ciphertext: 'encrypted' },
      config: null,
      enabled: true,
      usageCount: 1,
      lastUsed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const integration = await module.connectIntegration({
      organizationId: 'org-e2e',
      provider: IntegrationProvider.OPENAI,
      credentials: { apiKey: 'secret' },
    });
    expect(integration.id).toBe('integration-1');

    const sync = await module.syncIntegration('integration-1');
    expect(sync.status).toBe('synced');

    const creds = await module.getDecryptedCredentials('integration-1');
    expect(creds).toEqual({ apiKey: 'plain' });
  });
});

import { describe, expect, it, beforeEach } from 'vitest';
import { StudioIntegrationModule } from '../../modules/integrations';
import { prismaMock } from '../mocks/prisma';

const credentialStore = {
  encrypt: async () => ({ ciphertext: 'encrypted' }),
  decrypt: async () => ({ apiKey: 'plain' }),
};

describe('Integration flow e2e', () => {
  const module = new StudioIntegrationModule({
    credentialStore: credentialStore as any,
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
      usageCount: 0,
    } as any);
    prismaMock.studioIntegration.update.mockResolvedValue({
      id: 'integration-1',
      usageCount: 1,
    } as any);
    prismaMock.studioIntegration.findUniqueOrThrow.mockResolvedValue({
      id: 'integration-1',
      credentials: { ciphertext: 'encrypted' },
    } as any);

    const integration = await module.connectIntegration({
      organizationId: 'org-e2e',
      provider: 'OPENAI' as any,
      credentials: { apiKey: 'secret' },
    });
    expect(integration.id).toBe('integration-1');

    const sync = await module.syncIntegration('integration-1');
    expect(sync.status).toBe('synced');

    const creds = await module.getDecryptedCredentials('integration-1');
    expect(creds).toEqual({ apiKey: 'plain' });
  });
});





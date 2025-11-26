import { describe, expect, it, vi, beforeEach } from 'bun:test';
import { StudioIntegrationModule } from './index';
import { prismaMock } from '../../__tests__/mocks/prisma';

const credentialStoreMock = {
  encrypt: vi.fn(),
  decrypt: vi.fn(),
};

describe('StudioIntegrationModule', () => {
  beforeEach(() => {
    credentialStoreMock.encrypt.mockReset();
    credentialStoreMock.decrypt.mockReset();
  });

  it('connects integrations with encrypted credentials', async () => {
    const module = new StudioIntegrationModule({
      credentialStore: credentialStoreMock as any,
    });
    credentialStoreMock.encrypt.mockResolvedValue({ encoded: 'abc' });
    prismaMock.studioIntegration.create.mockResolvedValue({
      id: 'integration-1',
    } as any);

    const integration = await module.connectIntegration({
      organizationId: 'org-1',
      provider: 'OPENAI' as any,
      credentials: { apiKey: 'secret' },
    });

    expect(credentialStoreMock.encrypt).toHaveBeenCalledWith(
      'org-1',
      'OPENAI',
      { apiKey: 'secret' }
    );
    expect(prismaMock.studioIntegration.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organizationId: 'org-1',
        credentials: { encoded: 'abc' },
      }),
    });
    expect(integration.id).toBe('integration-1');
  });

  it('throws when encryption fails during connection', async () => {
    const module = new StudioIntegrationModule({
      credentialStore: credentialStoreMock as any,
    });
    credentialStoreMock.encrypt.mockRejectedValue(new Error('cannot encrypt'));

    await expect(
      module.connectIntegration({
        organizationId: 'org-1',
        provider: 'OPENAI' as any,
        credentials: { apiKey: 'secret' },
      })
    ).rejects.toThrow('cannot encrypt');
  });

  it('syncs integrations and returns usage stats', async () => {
    const module = new StudioIntegrationModule({
      credentialStore: credentialStoreMock as any,
    });
    prismaMock.studioIntegration.update.mockResolvedValue({
      id: 'integration-1',
      usageCount: 3,
    } as any);

    const result = await module.syncIntegration('integration-1');

    expect(prismaMock.studioIntegration.update).toHaveBeenCalledWith({
      where: { id: 'integration-1' },
      data: expect.objectContaining({
        usageCount: { increment: 1 },
      }),
    });
    expect(result).toMatchObject({
      integrationId: 'integration-1',
      usageCount: 3,
      status: 'synced',
    });
  });

  it('decrypts stored credentials via credential store', async () => {
    const module = new StudioIntegrationModule({
      credentialStore: credentialStoreMock as any,
    });
    prismaMock.studioIntegration.findUniqueOrThrow.mockResolvedValue({
      id: 'integration-1',
      credentials: { encoded: 'abc' },
    } as any);
    credentialStoreMock.decrypt.mockResolvedValue({ apiKey: 'secret' });

    const credentials = await module.getDecryptedCredentials('integration-1');

    expect(credentialStoreMock.decrypt).toHaveBeenCalledWith({
      encoded: 'abc',
    });
    expect(credentials).toEqual({ apiKey: 'secret' });
  });
});











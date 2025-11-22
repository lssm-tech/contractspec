import { describe, expect, it, beforeEach, vi } from 'vitest';
import { BYOKManager } from './manager';
import { prismaMock } from '../../__tests__/mocks/prisma';

const encryptMock = vi.fn();
const decryptMock = vi.fn();

describe('BYOKManager', () => {
  const manager = new BYOKManager({
    encryption: {
      encrypt: encryptMock,
      decrypt: decryptMock,
    } as any,
  });

  beforeEach(() => {
    encryptMock.mockReset();
    decryptMock.mockReset();
  });

  it('stores encrypted credentials via updateMany', async () => {
    encryptMock.mockReturnValue({ ciphertext: 'abc' });
    prismaMock.studioIntegration.updateMany.mockResolvedValue({} as any);

    await manager.storeCredentials('org-1', 'OPENAI' as any, { apiKey: 'x' });

    expect(encryptMock).toHaveBeenCalledWith('org-1', 'OPENAI', {
      apiKey: 'x',
    });
    expect(prismaMock.studioIntegration.updateMany).toHaveBeenCalledWith({
      where: expect.objectContaining({ organizationId: 'org-1' }),
      data: expect.objectContaining({ credentials: { ciphertext: 'abc' } }),
    });
  });

  it('retrieves and decrypts stored credentials', async () => {
    prismaMock.studioIntegration.findFirst.mockResolvedValue({
      id: 'integration-1',
      credentials: { ciphertext: 'abc' },
    } as any);
    decryptMock.mockReturnValue({ apiKey: 'decoded' });

    const credentials = await manager.getCredentials('org-1', 'OPENAI' as any);

    expect(credentials).toEqual({ apiKey: 'decoded' });
    expect(decryptMock).toHaveBeenCalled();
  });

  it('reports credential health status', async () => {
    prismaMock.studioIntegration.findFirst.mockResolvedValue({
      credentials: { ciphertext: 'abc' },
    } as any);
    decryptMock.mockReturnValue({ ok: true });

    const healthy = await manager.testCredentials('org-1', 'OPENAI' as any);
    expect(healthy).toEqual({ provider: 'OPENAI', healthy: true });

    prismaMock.studioIntegration.findFirst.mockResolvedValue(null);
    const unhealthy = await manager.testCredentials('org-1', 'OPENAI' as any);
    expect(unhealthy.healthy).toBe(false);
  });

  it('rotates keys by re-encrypting each integration', async () => {
    prismaMock.studioIntegration.findMany.mockResolvedValue([
      {
        id: 'integration-1',
        provider: 'OPENAI',
        credentials: { ciphertext: 'old' },
      },
    ] as any);
    decryptMock.mockReturnValue({ apiKey: 'decoded' });
    encryptMock.mockReturnValue({ ciphertext: 'new' });
    prismaMock.studioIntegration.update.mockResolvedValue({} as any);

    await manager.rotateKeys('org-1');

    expect(decryptMock).toHaveBeenCalled();
    expect(prismaMock.studioIntegration.update).toHaveBeenCalledWith({
      where: { id: 'integration-1' },
      data: expect.objectContaining({ credentials: { ciphertext: 'new' } }),
    });
  });

  it('revokes credentials by nulling stored payloads', async () => {
    prismaMock.studioIntegration.updateMany.mockResolvedValue({} as any);
    await manager.revokeCredentials('org-1', 'OPENAI' as any);
    expect(prismaMock.studioIntegration.updateMany).toHaveBeenCalledWith({
      where: expect.objectContaining({ organizationId: 'org-1' }),
      data: { credentials: null },
    });
  });
});


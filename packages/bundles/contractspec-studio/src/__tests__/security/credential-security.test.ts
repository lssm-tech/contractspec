import { describe, expect, it } from 'bun:test';
import { CredentialEncryption } from '../../infrastructure/byok/encryption';
import { BYOKManager } from '../../infrastructure/byok/manager';
import { prismaMock } from '../mocks/prisma';

describe('Credential security', () => {
  const encryption = new CredentialEncryption();

  it('never stores plaintext credentials in ciphertext payloads', () => {
    const encrypted = encryption.encrypt('org-secure', 'OPENAI' as any, {
      apiKey: 'super-secret-key',
    });

    expect(encrypted.ciphertext).not.toContain('super-secret-key');
    expect(encrypted.ciphertext).not.toContain('org-secure');
  });

  it('prevents decrypting credentials with mismatched organization keys', () => {
    const encrypted = encryption.encrypt('org-secure', 'OPENAI' as any, {
      apiKey: 'secret',
    });
    encrypted.organizationId = 'org-attacker';
    expect(() => encryption.decrypt(encrypted)).toThrow();
  });

  it('stores only encrypted payloads via BYOK manager', async () => {
    const manager = new BYOKManager({ encryption });
    prismaMock.studioIntegration.updateMany.mockResolvedValue({} as any);

    await manager.storeCredentials('org-secure', 'OPENAI' as any, {
      apiKey: 'secret',
    });

    const updateCall =
      prismaMock.studioIntegration.updateMany.mock.calls[0]?.[0];
    const storedCredentials = updateCall?.data?.credentials;
    expect(storedCredentials).toBeDefined();
    expect(storedCredentials.ciphertext).toBeDefined();
    expect(JSON.stringify(storedCredentials)).not.toContain('secret');
  });
});


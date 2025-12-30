import { describe, expect, it, beforeEach } from 'bun:test';
import { IntegrationProvider } from '@contractspec/lib.database-studio';
import { CredentialEncryption } from '../../infrastructure/byok/encryption';
import { BYOKManager } from '../../infrastructure/byok/manager';
import { prismaMock, resetPrismaMock } from '../mocks/prisma';

describe('Credential security', () => {
  const encryption = new CredentialEncryption();

  beforeEach(() => {
    resetPrismaMock();
  });

  it('never stores plaintext credentials in ciphertext payloads', () => {
    const encrypted = encryption.encrypt(
      'org-secure',
      IntegrationProvider.OPENAI,
      {
        apiKey: 'super-secret-key',
      }
    );

    expect(encrypted.ciphertext).not.toContain('super-secret-key');
    expect(encrypted.ciphertext).not.toContain('org-secure');
  });

  it('prevents decrypting credentials with mismatched organization keys', () => {
    const encrypted = encryption.encrypt(
      'org-secure',
      IntegrationProvider.OPENAI,
      {
        apiKey: 'secret',
      }
    );
    encrypted.organizationId = 'org-attacker';
    expect(() => encryption.decrypt(encrypted)).toThrow();
  });

  it('stores only encrypted payloads via BYOK manager', async () => {
    const manager = new BYOKManager({ encryption });
    prismaMock.studioIntegration.updateMany.mockResolvedValue({ count: 1 });

    await manager.storeCredentials('org-secure', IntegrationProvider.OPENAI, {
      apiKey: 'secret',
    });

    const updateCall =
      prismaMock.studioIntegration.updateMany.mock.calls[0]?.[0];
    const storedCredentials = updateCall?.data?.credentials as
      | Record<string, unknown>
      | undefined;
    expect(storedCredentials).toBeDefined();
    expect(storedCredentials?.ciphertext).toBeDefined();
    expect(JSON.stringify(storedCredentials)).not.toContain('secret');
  });
});

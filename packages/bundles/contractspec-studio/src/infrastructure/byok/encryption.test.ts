import { describe, expect, it } from 'bun:test';
import { CredentialEncryption } from './encryption';

describe('CredentialEncryption', () => {
  const encryption = new CredentialEncryption();

  it('encrypts and decrypts credentials symmetrically', () => {
    const payload = { apiKey: 'secret', region: 'eu' };
    const encrypted = encryption.encrypt('org-1', 'OPENAI' as any, payload);
    const decrypted = encryption.decrypt<typeof payload>(encrypted);

    expect(encrypted).toHaveProperty('ciphertext');
    expect(encrypted).toHaveProperty('iv');
    expect(decrypted).toEqual(payload);
  });

  it('fails to decrypt when organization id changes', () => {
    const encrypted = encryption.encrypt('org-1', 'OPENAI' as any, {
      apiKey: 'secret',
    });
    encrypted.organizationId = 'org-2';

    expect(() => encryption.decrypt(encrypted)).toThrow();
  });

  it('derives deterministic keys per organization', () => {
    const first = encryption.encrypt('org-99', 'OPENAI' as any, {
      token: 'one',
    });
    const secondEncryption = new CredentialEncryption();
    const second = secondEncryption.encrypt('org-99', 'OPENAI' as any, {
      token: 'two',
    });

    expect(encryption.decrypt(first)).toEqual({ token: 'one' });
    expect(secondEncryption.decrypt(second)).toEqual({ token: 'two' });
  });
});








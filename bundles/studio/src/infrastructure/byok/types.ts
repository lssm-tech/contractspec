import type { IntegrationProvider } from '@contractspec/lib.database-studio';

export interface EncryptedCredentials {
  provider: IntegrationProvider;
  organizationId: string;
  ciphertext: string;
  iv: string;
  authTag: string;
  version: string;
  createdAt: string;
}

export interface CredentialTestResult {
  provider: IntegrationProvider;
  healthy: boolean;
  message?: string;
}

export interface BYOKKeyPair {
  organizationId: string;
  encryptionKey: Buffer;
  iv: Buffer;
}

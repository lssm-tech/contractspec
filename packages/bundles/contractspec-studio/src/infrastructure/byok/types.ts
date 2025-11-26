import type { IntegrationProvider } from '@lssm/lib.database-contractspec-studio';

export interface EncryptedCredentials {
  provider: IntegrationProvider;
  organizationId: string;
  ciphertext: string;
  iv: string;
  authTag: string;
  version: number;
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











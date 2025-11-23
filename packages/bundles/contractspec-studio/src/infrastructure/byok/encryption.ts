import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';
import type { IntegrationProvider } from '@lssm/lib.database-contractspec-studio';
import type { EncryptedCredentials } from './types';

const ALGORITHM = 'aes-256-gcm';
const MASTER_SECRET =
  process.env.STUDIO_BYOK_MASTER_KEY ?? 'studio-dev-master-key';

export class CredentialEncryption {
  encrypt(
    organizationId: string,
    provider: IntegrationProvider,
    credentials: Record<string, string>
  ): EncryptedCredentials {
    const key = deriveKey(organizationId);
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const payload = Buffer.from(JSON.stringify(credentials), 'utf-8');
    const ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      provider,
      organizationId,
      ciphertext: ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      version: 1,
      createdAt: new Date().toISOString(),
    };
  }

  decrypt<T = Record<string, string>>(encrypted: EncryptedCredentials): T {
    const key = deriveKey(encrypted.organizationId);
    const decipher = createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(encrypted.iv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(encrypted.authTag, 'base64'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(encrypted.ciphertext, 'base64')),
      decipher.final(),
    ]);
    return JSON.parse(plaintext.toString('utf-8'));
  }
}

function deriveKey(organizationId: string) {
  return createHash('sha256')
    .update(`${MASTER_SECRET}:${organizationId}`)
    .digest()
    .subarray(0, 32);
}



import {
  prisma as studioDb,
  IntegrationProvider,
  type StudioIntegration,
  Prisma,
} from '@contractspec/lib.database-studio';
import { CredentialEncryption } from './encryption';
import type { CredentialTestResult, EncryptedCredentials } from './types';
import { toJsonNullValue } from '../../utils/prisma-json';

export interface BYOKManagerOptions {
  encryption?: CredentialEncryption;
}

export class BYOKManager {
  private readonly encryption: CredentialEncryption;

  constructor(options: BYOKManagerOptions = {}) {
    this.encryption = options.encryption ?? new CredentialEncryption();
  }

  async storeCredentials(
    organizationId: string,
    provider: IntegrationProvider,
    credentials: Record<string, string>,
    integrationId?: string
  ): Promise<void> {
    const encrypted = this.encryption.encrypt(
      organizationId,
      provider,
      credentials
    );
    await studioDb.studioIntegration.updateMany({
      where: {
        organizationId,
        provider,
        ...(integrationId ? { id: integrationId } : {}),
      },
      data: {
        credentials: toJsonNullValue(encrypted),
      },
    });
  }

  async getCredentials(
    organizationId: string,
    provider: IntegrationProvider,
    integrationId?: string
  ) {
    const integration = await this.findIntegration(
      organizationId,
      provider,
      integrationId
    );
    if (!integration?.credentials) {
      throw new Error('Credentials not found');
    }
    return this.encryption.decrypt(
      integration.credentials as unknown as EncryptedCredentials
    );
  }

  async testCredentials(
    organizationId: string,
    provider: IntegrationProvider
  ): Promise<CredentialTestResult> {
    try {
      await this.getCredentials(organizationId, provider);
      return { provider, healthy: true };
    } catch (error) {
      return { provider, healthy: false, message: (error as Error).message };
    }
  }

  async rotateKeys(organizationId: string) {
    const integrations = await studioDb.studioIntegration.findMany({
      where: { organizationId },
    });
    await Promise.all(
      integrations.map(async (integration) => {
        if (!integration.credentials) return;
        const decrypted = this.encryption.decrypt(
          integration.credentials as unknown as EncryptedCredentials
        );
        const encrypted = this.encryption.encrypt(
          organizationId,
          integration.provider,
          decrypted
        );
        await studioDb.studioIntegration.update({
          where: { id: integration.id },
          data: {
            credentials: toJsonNullValue(encrypted),
          },
        });
      })
    );
  }

  async revokeCredentials(
    organizationId: string,
    provider: IntegrationProvider,
    integrationId?: string
  ) {
    await studioDb.studioIntegration.updateMany({
      where: {
        organizationId,
        provider,
        ...(integrationId ? { id: integrationId } : {}),
      },
      data: { credentials: Prisma.JsonNull },
    });
  }

  private async findIntegration(
    organizationId: string,
    provider: IntegrationProvider,
    integrationId?: string
  ): Promise<StudioIntegration | null> {
    if (integrationId) {
      return studioDb.studioIntegration.findFirst({
        where: { id: integrationId, organizationId, provider },
      });
    }
    return studioDb.studioIntegration.findFirst({
      where: { organizationId, provider },
      orderBy: { createdAt: 'desc' },
    });
  }
}

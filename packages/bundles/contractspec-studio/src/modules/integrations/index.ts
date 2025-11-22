import { Buffer } from 'node:buffer';
import type { Logger } from '@lssm/lib.logger';
import {
  prisma,
  IntegrationProvider,
  type Prisma,
  type StudioIntegration,
} from '@lssm/lib.database-contractspec-studio';

export interface ConnectIntegrationInput {
  organizationId: string;
  provider: IntegrationProvider;
  credentials: Record<string, string>;
  projectId?: string;
  name?: string;
  config?: Prisma.JsonValue;
}

export interface SyncResult {
  integrationId: string;
  status: 'queued' | 'synced';
  syncedAt: Date;
  usageCount: number;
}

export interface CredentialStore {
  encrypt(
    organizationId: string,
    provider: IntegrationProvider,
    credentials: Record<string, string>
  ): Promise<Prisma.JsonValue>;
  decrypt(payload: Prisma.JsonValue): Promise<Record<string, string>>;
}

class JsonCredentialStore implements CredentialStore {
  async encrypt(
    organizationId: string,
    provider: IntegrationProvider,
    credentials: Record<string, string>
  ): Promise<Prisma.JsonValue> {
    return {
      version: 1,
      organizationId,
      provider,
      encoded: Buffer.from(JSON.stringify(credentials)).toString('base64'),
    };
  }

  async decrypt(payload: Prisma.JsonValue): Promise<Record<string, string>> {
    if (
      !payload ||
      typeof payload !== 'object' ||
      !('encoded' in payload) ||
      typeof payload.encoded !== 'string'
    ) {
      throw new Error('Invalid credential payload');
    }
    const decoded = Buffer.from(payload.encoded, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }
}

export interface StudioIntegrationModuleOptions {
  credentialStore?: CredentialStore;
  logger?: Logger;
}

export class StudioIntegrationModule {
  private readonly credentials: CredentialStore;
  private readonly logger?: Logger;

  constructor(options: StudioIntegrationModuleOptions = {}) {
    this.credentials = options.credentialStore ?? new JsonCredentialStore();
    this.logger = options.logger;
  }

  async connectIntegration(
    input: ConnectIntegrationInput
  ): Promise<StudioIntegration> {
    const encrypted = await this.credentials.encrypt(
      input.organizationId,
      input.provider,
      input.credentials
    );

    const integration = await prisma.studioIntegration.create({
      data: {
        organizationId: input.organizationId,
        projectId: input.projectId,
        provider: input.provider,
        name: input.name ?? input.provider,
        credentials: encrypted,
        config: input.config ?? {},
        enabled: true,
      },
    });

    this.logger?.info?.('studio.integration.connected', {
      integrationId: integration.id,
      provider: input.provider,
    });

    return integration;
  }

  async disconnectIntegration(integrationId: string): Promise<void> {
    await prisma.studioIntegration.update({
      where: { id: integrationId },
      data: { enabled: false },
    });
    this.logger?.info?.('studio.integration.disabled', { integrationId });
  }

  async syncIntegration(integrationId: string): Promise<SyncResult> {
    const integration = await prisma.studioIntegration.update({
      where: { id: integrationId },
      data: {
        usageCount: { increment: 1 },
        lastUsed: new Date(),
      },
    });

    this.logger?.debug?.('studio.integration.sync', {
      integrationId,
      usageCount: integration.usageCount,
    });

    return {
      integrationId,
      status: 'synced',
      syncedAt: new Date(),
      usageCount: integration.usageCount,
    };
  }

  async getDecryptedCredentials(integrationId: string) {
    const integration = await prisma.studioIntegration.findUniqueOrThrow({
      where: { id: integrationId },
      select: { credentials: true },
    });
    return this.credentials.decrypt(integration.credentials);
  }
}


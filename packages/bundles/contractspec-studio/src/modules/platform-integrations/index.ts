import type { Logger } from '@lssm/lib.logger';
import {
  prisma,
  type IntegrationConnection,
  type Prisma,
} from '@lssm/lib.database-contractspec-studio';
import type {
  IntegrationCategory,
  IntegrationSpec,
} from '@lssm/lib.contracts/integrations/spec';
import { createDefaultIntegrationSpecRegistry } from '@lssm/lib.contracts/integrations/providers/registry';
import {
  AwsSecretsManagerProvider,
  EnvSecretProvider,
  GcpSecretManagerProvider,
  ScalewaySecretManagerProvider,
  SecretProviderManager,
} from '@lssm/lib.contracts/integrations/secrets';
import type {
  SecretPayloadEncoding,
  SecretProvider,
} from '@lssm/lib.contracts/integrations/secrets/provider';

import { toInputJson } from '../../utils/prisma-json';

export type PlatformIntegrationOwnershipMode = 'managed' | 'byok';
export type PlatformIntegrationConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'unknown';

export interface ListPlatformIntegrationConnectionsInput {
  organizationId: string;
  category?: IntegrationCategory;
  status?: PlatformIntegrationConnectionStatus;
}

export interface CreatePlatformIntegrationConnectionInput {
  organizationId: string;
  integrationKey: string;
  integrationVersion: number;
  label: string;
  environment?: string;
  ownershipMode: PlatformIntegrationOwnershipMode;
  externalAccountId?: string;
  secretProvider: string;
  secretRef: string;
  config: Record<string, unknown>;
  status?: PlatformIntegrationConnectionStatus;
  /**
   * Optional write-only payload. When provided, we write/rotate the secret and
   * persist the returned reference. We never return the secret.
   */
  secretWrite?: {
    data: string;
    encoding?: SecretPayloadEncoding;
  };
}

export interface UpdatePlatformIntegrationConnectionInput {
  organizationId: string;
  connectionId: string;
  label?: string;
  environment?: string;
  ownershipMode?: PlatformIntegrationOwnershipMode;
  externalAccountId?: string;
  secretProvider?: string;
  secretRef?: string;
  config?: Record<string, unknown>;
  status?: PlatformIntegrationConnectionStatus;
  secretWrite?: {
    data: string;
    encoding?: SecretPayloadEncoding;
  };
}

export interface DeletePlatformIntegrationConnectionInput {
  organizationId: string;
  connectionId: string;
}

export interface PlatformIntegrationsModuleOptions {
  secrets?: SecretProvider;
  logger?: Logger;
}

export class PlatformIntegrationsModule {
  private readonly secrets: SecretProvider;
  private readonly logger?: Logger;

  constructor(options: PlatformIntegrationsModuleOptions = {}) {
    this.secrets = options.secrets ?? createDefaultSecretProvider();
    this.logger = options.logger;
  }

  listIntegrationSpecs(): IntegrationSpec[] {
    return createDefaultIntegrationSpecRegistry().list();
  }

  async listConnections(
    input: ListPlatformIntegrationConnectionsInput
  ): Promise<IntegrationConnection[]> {
    const registry = createDefaultIntegrationSpecRegistry();
    const keysByCategory = input.category
      ? registry.getByCategory(input.category).map((spec) => spec.meta.key)
      : undefined;

    return prisma.integrationConnection.findMany({
      where: {
        organizationId: input.organizationId,
        ...(keysByCategory ? { integrationKey: { in: keysByCategory } } : {}),
        ...(input.status ? { status: input.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createConnection(
    input: CreatePlatformIntegrationConnectionInput
  ): Promise<IntegrationConnection> {
    assertOwnershipMode(input.ownershipMode);
    assertConnectionStatus(input.status);

    const registry = createDefaultIntegrationSpecRegistry();
    const spec = registry.get(input.integrationKey, input.integrationVersion);
    if (!spec) {
      throw new Error(
        `Unknown integration spec: ${input.integrationKey} v${input.integrationVersion}`
      );
    }

    const resolvedSecretRef = input.secretWrite
      ? await this.writeSecret(input.secretRef, input.secretWrite)
      : input.secretRef;

    const record = await prisma.integrationConnection.create({
      data: {
        organizationId: input.organizationId,
        integrationKey: spec.meta.key,
        integrationVersion: spec.meta.version,
        label: input.label,
        environment: input.environment,
        ownershipMode: input.ownershipMode,
        externalAccountId: input.externalAccountId,
        secretProvider: input.secretProvider,
        secretRef: resolvedSecretRef,
        config: toInputJson(input.config),
        status: input.status ?? 'unknown',
      },
    });

    this.logger?.info?.('platform.integration.connection.created', {
      connectionId: record.id,
      organizationId: input.organizationId,
      integrationKey: record.integrationKey,
      integrationVersion: record.integrationVersion,
    });

    return record;
  }

  async updateConnection(
    input: UpdatePlatformIntegrationConnectionInput
  ): Promise<IntegrationConnection> {
    if (input.ownershipMode) {
      assertOwnershipMode(input.ownershipMode);
    }
    assertConnectionStatus(input.status);

    const existing = await prisma.integrationConnection.findFirst({
      where: {
        id: input.connectionId,
        organizationId: input.organizationId,
      },
      select: {
        id: true,
        organizationId: true,
        secretRef: true,
      },
    });

    if (!existing) {
      throw new Error('Integration connection not found');
    }

    const secretRefCandidate = input.secretRef ?? existing.secretRef;

    const resolvedSecretRef = input.secretWrite
      ? await this.writeSecret(secretRefCandidate, input.secretWrite)
      : input.secretRef;

    const record = await prisma.integrationConnection.update({
      where: { id: input.connectionId },
      data: {
        label: input.label,
        environment: input.environment,
        ownershipMode: input.ownershipMode,
        externalAccountId: input.externalAccountId,
        secretProvider: input.secretProvider,
        secretRef: resolvedSecretRef,
        config: input.config ? toInputJson(input.config) : undefined,
        status: input.status,
      },
    });

    this.logger?.info?.('platform.integration.connection.updated', {
      connectionId: record.id,
      organizationId: input.organizationId,
    });

    return record;
  }

  async deleteConnection(
    input: DeletePlatformIntegrationConnectionInput
  ): Promise<boolean> {
    const existing = await prisma.integrationConnection.findFirst({
      where: {
        id: input.connectionId,
        organizationId: input.organizationId,
      },
      select: { id: true },
    });

    if (!existing) {
      return false;
    }

    await prisma.integrationConnection.delete({
      where: { id: input.connectionId },
    });

    this.logger?.info?.('platform.integration.connection.deleted', {
      connectionId: input.connectionId,
      organizationId: input.organizationId,
    });

    return true;
  }

  async canAccessSecret(secretRef: string): Promise<boolean> {
    await this.secrets.getSecret(secretRef);
    return true;
  }

  private async writeSecret(
    reference: string,
    payload: { data: string; encoding?: SecretPayloadEncoding }
  ): Promise<string> {
    const result = await this.secrets.setSecret(reference, {
      data: payload.data,
      encoding: payload.encoding,
    });
    return result.reference;
  }
}

function createDefaultSecretProvider(): SecretProvider {
  const manager = new SecretProviderManager();
  manager.register(new EnvSecretProvider(), { priority: 10 });
  manager.register(new GcpSecretManagerProvider(), { priority: 1 });
  manager.register(new AwsSecretsManagerProvider(), { priority: 1 });
  manager.register(new ScalewaySecretManagerProvider(), { priority: 1 });
  return manager;
}

function assertOwnershipMode(
  mode: PlatformIntegrationOwnershipMode
): asserts mode is PlatformIntegrationOwnershipMode {
  if (mode !== 'managed' && mode !== 'byok') {
    throw new Error(`Invalid ownershipMode: ${mode}`);
  }
}

function assertConnectionStatus(
  status?: PlatformIntegrationConnectionStatus
): void {
  if (!status) return;
  const allowed: PlatformIntegrationConnectionStatus[] = [
    'connected',
    'disconnected',
    'error',
    'unknown',
  ];
  if (!allowed.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
}

export type { IntegrationConnection, Prisma };


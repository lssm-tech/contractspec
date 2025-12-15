import { gqlSchemaBuilder } from '../builder';
import { requireAuth } from '../types';
import {
  prisma,
  OrganizationType,
  IntegrationConnectionStatus,
  IntegrationOwnershipMode,
} from '@lssm/lib.database-contractspec-studio';
import type {
  IntegrationCategory,
  IntegrationSpec,
} from '@lssm/lib.contracts/integrations/spec';
import type { SecretPayloadEncoding } from '@lssm/lib.contracts/integrations/secrets/provider';
import { PlatformIntegrationsModule } from '../../../modules/platform-integrations';

const platformIntegrations = new PlatformIntegrationsModule();

const debugGraphQL = process.env.CONTRACTSPEC_DEBUG_GRAPHQL_BUILDER === 'true';

if (debugGraphQL) {
  console.log('[graphql-platform-admin] module loaded');
}

export function registerPlatformAdminSchema(builder: typeof gqlSchemaBuilder) {
  if (debugGraphQL) {
    console.log('[graphql-platform-admin] registering schema');
  }

  const IntegrationOwnershipModeEnum = builder.enumType(
    'IntegrationOwnershipModeEnum',
    {
      values: Object.values(IntegrationOwnershipMode),
    }
  );

  const IntegrationConnectionStatusEnum = builder.enumType(
    'IntegrationConnectionStatusEnum',
    {
      values: Object.values(IntegrationConnectionStatus),
    }
  );

  // --- Prisma objects

  const IntegrationConnectionType = builder.prismaObject(
    'IntegrationConnection',
    {
      fields: (t) => ({
        id: t.exposeID('id', { nullable: false }),
        organizationId: t.exposeString('organizationId'),
        integrationKey: t.exposeString('integrationKey'),
        integrationVersion: t.exposeInt('integrationVersion'),
        label: t.exposeString('label'),
        environment: t.exposeString('environment', { nullable: true }),
        ownershipMode: t.field({
          type: IntegrationOwnershipModeEnum,
          resolve: (c) => c.ownershipMode,
        }),
        externalAccountId: t.exposeString('externalAccountId', {
          nullable: true,
        }),
        secretProvider: t.exposeString('secretProvider'),
        secretRef: t.exposeString('secretRef'),
        config: t.field({
          type: 'JSON',
          resolve: (c) => c.config,
        }),
        status: t.field({
          type: IntegrationConnectionStatusEnum,
          resolve: (c) => c.status,
        }),
        healthStatus: t.field({
          type: IntegrationConnectionStatusEnum,
          nullable: true,
          resolve: (c) => c.healthStatus,
        }),
        healthCheckedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (c) => c.healthCheckedAt,
        }),
        healthLatencyMs: t.exposeFloat('healthLatencyMs', { nullable: true }),
        healthErrorCode: t.exposeString('healthErrorCode', { nullable: true }),
        healthErrorMessage: t.exposeString('healthErrorMessage', {
          nullable: true,
        }),
        usageRequestCount: t.exposeInt('usageRequestCount'),
        usageSuccessCount: t.exposeInt('usageSuccessCount'),
        usageErrorCount: t.exposeInt('usageErrorCount'),
        usageLastUsedAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (c) => c.usageLastUsedAt,
        }),
        usageLastSuccessAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (c) => c.usageLastSuccessAt,
        }),
        usageLastErrorAt: t.field({
          type: 'Date',
          nullable: true,
          resolve: (c) => c.usageLastErrorAt,
        }),
        usageLastErrorCode: t.exposeString('usageLastErrorCode', {
          nullable: true,
        }),
        createdAt: t.field({ type: 'Date', resolve: (c) => c.createdAt }),
        updatedAt: t.field({ type: 'Date', resolve: (c) => c.updatedAt }),
      }),
    }
  );

  // --- Non-prisma objects

  const PlatformIntegrationSpecType = builder
    .objectRef<IntegrationSpec>('PlatformIntegrationSpec')
    .implement({
      fields: (t) => ({
        key: t.string({ resolve: (s) => s.meta.key }),
        version: t.int({ resolve: (s) => s.meta.version }),
        category: t.string({ resolve: (s) => s.meta.category }),
        displayName: t.string({ resolve: (s) => s.meta.displayName }),
        title: t.string({ resolve: (s) => s.meta.title }),
        description: t.string({ resolve: (s) => s.meta.description }),
        supportedModes: t.field({
          type: ['String'],
          resolve: (s) => s.supportedModes,
        }),
        docsUrl: t.string({
          nullable: true,
          resolve: (s) => s.docsUrl ?? null,
        }),
        configSchema: t.field({
          type: 'JSON',
          resolve: (s) => s.configSchema,
        }),
        secretSchema: t.field({
          type: 'JSON',
          resolve: (s) => s.secretSchema,
        }),
        byokSetup: t.field({
          type: 'JSON',
          nullable: true,
          resolve: (s) => s.byokSetup ?? null,
        }),
      }),
    });

  const SecretWriteInput = builder.inputType('PlatformSecretWriteInput', {
    fields: (t) => ({
      data: t.string({ required: true }),
      encoding: t.string(),
    }),
  });

  const CreateConnectionInput = builder.inputType(
    'PlatformIntegrationConnectionCreateInput',
    {
      fields: (t) => ({
        targetOrganizationId: t.string({ required: true }),
        integrationKey: t.string({ required: true }),
        integrationVersion: t.int({ required: true }),
        label: t.string({ required: true }),
        environment: t.string(),
        ownershipMode: t.field({
          type: IntegrationOwnershipModeEnum,
          required: true,
        }),
        externalAccountId: t.string(),
        secretProvider: t.string({ required: true }),
        secretRef: t.string({ required: true }),
        config: t.field({ type: 'JSON', required: true }),
        status: t.field({ type: IntegrationConnectionStatusEnum }),
        secretWrite: t.field({ type: SecretWriteInput }),
      }),
    }
  );

  const UpdateConnectionInput = builder.inputType(
    'PlatformIntegrationConnectionUpdateInput',
    {
      fields: (t) => ({
        targetOrganizationId: t.string({ required: true }),
        connectionId: t.string({ required: true }),
        label: t.string(),
        environment: t.string(),
        ownershipMode: t.field({ type: IntegrationOwnershipModeEnum }),
        externalAccountId: t.string(),
        secretProvider: t.string(),
        secretRef: t.string(),
        config: t.field({ type: 'JSON' }),
        status: t.field({ type: IntegrationConnectionStatusEnum }),
        secretWrite: t.field({ type: SecretWriteInput }),
      }),
    }
  );

  const ListConnectionsInput = builder.inputType(
    'PlatformIntegrationConnectionListInput',
    {
      fields: (t) => ({
        targetOrganizationId: t.string({ required: true }),
        category: t.string(),
        status: t.field({ type: IntegrationConnectionStatusEnum }),
      }),
    }
  );

  builder.queryFields((t) => ({
    platformAdminOrganizations: t.prismaField({
      type: ['Organization'],
      args: {
        search: t.arg.string(),
        limit: t.arg.int(),
        offset: t.arg.int(),
      },
      resolve: async (query, _root, args, ctx) => {
        await assertPlatformAdmin(ctx);

        const take = clampInt(args.limit ?? 50, 1, 200);
        const skip = clampInt(args.offset ?? 0, 0, 50_000);

        const search = args.search?.trim();
        const searchFilter = search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { slug: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {};

        return prisma.organization.findMany({
          ...query,
          where: {
            ...searchFilter,
          },
          orderBy: { createdAt: 'desc' },
          take,
          skip,
        });
      },
    }),

    platformAdminIntegrationSpecs: t.field({
      type: [PlatformIntegrationSpecType],
      resolve: async (_root, _args, ctx) => {
        await assertPlatformAdmin(ctx);
        return platformIntegrations.listIntegrationSpecs();
      },
    }),

    platformAdminIntegrationConnections: t.field({
      type: [IntegrationConnectionType],
      args: {
        input: t.arg({ type: ListConnectionsInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        await assertPlatformAdmin(ctx);

        return platformIntegrations.listConnections({
          organizationId: args.input.targetOrganizationId,
          category: parseCategory(args.input.category),
          status: args.input.status ?? undefined,
        });
      },
    }),
  }));

  builder.mutationFields((t) => ({
    platformAdminIntegrationConnectionCreate: t.field({
      type: IntegrationConnectionType,
      args: {
        input: t.arg({ type: CreateConnectionInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        await assertPlatformAdmin(ctx);

        return platformIntegrations.createConnection({
          organizationId: args.input.targetOrganizationId,
          integrationKey: args.input.integrationKey,
          integrationVersion: args.input.integrationVersion,
          label: args.input.label,
          environment: args.input.environment ?? undefined,
          ownershipMode: args.input.ownershipMode,
          externalAccountId: args.input.externalAccountId ?? undefined,
          secretProvider: args.input.secretProvider,
          secretRef: args.input.secretRef,
          config: ensureRecord(args.input.config, 'config'),
          status: args.input.status ?? undefined,
          secretWrite: args.input.secretWrite
            ? {
                data: args.input.secretWrite.data,
                encoding: parseEncoding(args.input.secretWrite.encoding),
              }
            : undefined,
        });
      },
    }),

    platformAdminIntegrationConnectionUpdate: t.field({
      type: IntegrationConnectionType,
      args: {
        input: t.arg({ type: UpdateConnectionInput, required: true }),
      },
      resolve: async (_root, args, ctx) => {
        await assertPlatformAdmin(ctx);

        return platformIntegrations.updateConnection({
          organizationId: args.input.targetOrganizationId,
          connectionId: args.input.connectionId,
          label: args.input.label ?? undefined,
          environment: args.input.environment ?? undefined,
          ownershipMode: args.input.ownershipMode ?? undefined,
          externalAccountId: args.input.externalAccountId ?? undefined,
          secretProvider: args.input.secretProvider ?? undefined,
          secretRef: args.input.secretRef ?? undefined,
          config: args.input.config
            ? ensureRecord(args.input.config, 'config')
            : undefined,
          status: args.input.status ?? undefined,
          secretWrite: args.input.secretWrite
            ? {
                data: args.input.secretWrite.data,
                encoding: parseEncoding(args.input.secretWrite.encoding),
              }
            : undefined,
        });
      },
    }),

    platformAdminIntegrationConnectionDelete: t.boolean({
      args: {
        targetOrganizationId: t.arg.string({ required: true }),
        connectionId: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        await assertPlatformAdmin(ctx);
        return platformIntegrations.deleteConnection({
          organizationId: args.targetOrganizationId,
          connectionId: args.connectionId,
        });
      },
    }),

    platformAdminSecretCheck: t.boolean({
      args: {
        secretRef: t.arg.string({ required: true }),
      },
      resolve: async (_root, args, ctx) => {
        await assertPlatformAdmin(ctx);
        return platformIntegrations.canAccessSecret(args.secretRef);
      },
    }),
  }));

  if (debugGraphQL) {
    console.log('[graphql-platform-admin] schema ready');
  }
}

async function assertPlatformAdmin(ctx: Parameters<typeof requireAuth>[0]) {
  requireAuth(ctx);
  const organizationId =
    ctx.session?.activeOrganizationId ?? ctx.organization?.id;
  if (!organizationId) {
    throw new Error('Forbidden: no active organization');
  }
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { type: true },
  });
  if (!org || org.type !== OrganizationType.PLATFORM_ADMIN) {
    throw new Error('Forbidden: requires PLATFORM_ADMIN');
  }
}

function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function ensureRecord(value: unknown, field: string): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  throw new Error(`${field} must be a JSON object`);
}

function parseEncoding(
  value: string | null | undefined
): SecretPayloadEncoding | undefined {
  if (!value) return undefined;
  if (value === 'utf-8' || value === 'base64' || value === 'binary') {
    return value;
  }
  throw new Error(`Invalid secret encoding: ${value}`);
}

const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  'payments',
  'email',
  'calendar',
  'sms',
  'ai-llm',
  'ai-voice',
  'speech-to-text',
  'vector-db',
  'storage',
  'accounting',
  'crm',
  'helpdesk',
  'open-banking',
  'custom',
];

function parseCategory(
  value: string | null | undefined
): IntegrationCategory | undefined {
  if (!value) return undefined;
  if ((INTEGRATION_CATEGORIES as readonly string[]).includes(value)) {
    return value as IntegrationCategory;
  }
  throw new Error(`Invalid integration category: ${value}`);
}


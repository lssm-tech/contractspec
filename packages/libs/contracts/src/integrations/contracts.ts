import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';
import { defineCommand, defineQuery, type ContractSpec } from '../spec';
import type { SpecRegistry } from '../registry';

const IntegrationConnectionRecord = new SchemaModel({
  name: 'IntegrationConnectionRecord',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    integrationKey: {
      type: ScalarTypeEnum.NonEmptyString(),
      isOptional: false,
    },
    integrationVersion: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    label: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownershipMode: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    externalAccountId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    secretProvider: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    secretRef: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    healthStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    healthCheckedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    healthLatencyMs: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    healthErrorCode: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    healthErrorMessage: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    usageRequestCount: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    usageSuccessCount: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    usageErrorCount: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    usageLastUsedAt: {
      type: ScalarTypeEnum.DateTime(),
      isOptional: true,
    },
    usageLastErrorAt: {
      type: ScalarTypeEnum.DateTime(),
      isOptional: true,
    },
    usageLastErrorCode: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const CreateIntegrationConnectionInput = new SchemaModel({
  name: 'CreateIntegrationConnectionInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    integrationKey: {
      type: ScalarTypeEnum.NonEmptyString(),
      isOptional: false,
    },
    integrationVersion: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    label: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownershipMode: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    externalAccountId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    secretProvider: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    secretRef: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    config: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
  },
});

const UpdateIntegrationConnectionInput = new SchemaModel({
  name: 'UpdateIntegrationConnectionInput',
  fields: {
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    label: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    ownershipMode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    externalAccountId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    secretProvider: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    secretRef: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    config: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

const DeleteIntegrationConnectionInput = new SchemaModel({
  name: 'DeleteIntegrationConnectionInput',
  fields: {
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

const ListIntegrationConnectionsInput = new SchemaModel({
  name: 'ListIntegrationConnectionsInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ListIntegrationConnectionsOutput = new SchemaModel({
  name: 'ListIntegrationConnectionsOutput',
  fields: {
    connections: {
      type: IntegrationConnectionRecord,
      isOptional: false,
      isArray: true,
    },
  },
});

const TestIntegrationConnectionInput = new SchemaModel({
  name: 'TestIntegrationConnectionInput',
  fields: {
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

const TestIntegrationConnectionOutput = new SchemaModel({
  name: 'TestIntegrationConnectionOutput',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    latencyMs: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    error: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    errorCode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const DeleteIntegrationConnectionOutput = new SchemaModel({
  name: 'DeleteIntegrationConnectionOutput',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const CreateIntegrationConnection = defineCommand({
  meta: {
    name: 'integrations.connection.create',
    version: 1,
    description: 'Create a new integration connection for a tenant.',
    goal: 'Provision a tenant-scoped connection to an external provider.',
    context:
      'Used by Ops or the App Studio to configure external integrations such as Stripe or Qdrant.',
    owners: ['platform.integrations'],
    tags: ['integration', 'connections'],
    stability: 'experimental',
  },
  io: {
    input: CreateIntegrationConnectionInput,
    output: IntegrationConnectionRecord,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.integration.manage', version: 1 }],
  },
});

export const UpdateIntegrationConnection = defineCommand({
  meta: {
    name: 'integrations.connection.update',
    version: 1,
    description:
      'Update metadata or credentials for an integration connection.',
    goal: 'Allow secure rotation of credentials and metadata adjustments.',
    context:
      'Supports rotating API keys, toggling status, or updating labels for tenant integrations.',
    owners: ['platform.integrations'],
    tags: ['integration', 'connections'],
    stability: 'experimental',
  },
  io: {
    input: UpdateIntegrationConnectionInput,
    output: IntegrationConnectionRecord,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.integration.manage', version: 1 }],
  },
});

export const DeleteIntegrationConnection = defineCommand({
  meta: {
    name: 'integrations.connection.delete',
    version: 1,
    description: 'Delete an integration connection for a tenant.',
    goal: 'Safely remove credentials and disable connector usage.',
    context:
      'Ensures connections are de-provisioned when no longer needed or breached.',
    owners: ['platform.integrations'],
    tags: ['integration', 'connections'],
    stability: 'experimental',
  },
  io: {
    input: DeleteIntegrationConnectionInput,
    output: DeleteIntegrationConnectionOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.integration.manage', version: 1 }],
  },
});

export const ListIntegrationConnections = defineQuery({
  meta: {
    name: 'integrations.connection.list',
    version: 1,
    description: 'List integration connections for a tenant.',
    goal: 'Provide visibility into configured integrations and their status.',
    context:
      'Used by the App Studio and Ops flows to show bindings and health.',
    owners: ['platform.integrations'],
    tags: ['integration', 'connections'],
    stability: 'experimental',
  },
  io: {
    input: ListIntegrationConnectionsInput,
    output: ListIntegrationConnectionsOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.integration.read', version: 1 }],
  },
});

export const TestIntegrationConnection = defineCommand({
  meta: {
    name: 'integrations.connection.test',
    version: 1,
    description:
      'Run a health check against a configured integration connection.',
    goal: 'Validate credentials and connectivity for external providers.',
    context:
      'Triggered manually or by background monitors to confirm provider availability.',
    owners: ['platform.integrations'],
    tags: ['integration', 'connections'],
    stability: 'experimental',
  },
  io: {
    input: TestIntegrationConnectionInput,
    output: TestIntegrationConnectionOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.integration.manage', version: 1 }],
  },
});

export const integrationContracts: Record<string, ContractSpec<any, any>> = {
  CreateIntegrationConnection,
  UpdateIntegrationConnection,
  DeleteIntegrationConnection,
  ListIntegrationConnections,
  TestIntegrationConnection,
};

export function registerIntegrationContracts(registry: SpecRegistry) {
  return registry
    .register(CreateIntegrationConnection)
    .register(UpdateIntegrationConnection)
    .register(DeleteIntegrationConnection)
    .register(ListIntegrationConnections)
    .register(TestIntegrationConnection);
}

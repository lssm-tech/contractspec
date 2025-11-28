import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import { defineSchemaModel, ScalarTypeEnum, defineEnum } from '@lssm/lib.schema';

const OWNERS = ['example.integration-hub'] as const;

// ============ Enums ============

const IntegrationStatusSchemaEnum = defineEnum('IntegrationStatus', ['DRAFT', 'ACTIVE', 'PAUSED', 'ERROR', 'ARCHIVED']);
const ConnectionStatusSchemaEnum = defineEnum('ConnectionStatus', ['PENDING', 'CONNECTED', 'DISCONNECTED', 'ERROR', 'EXPIRED']);
const SyncDirectionSchemaEnum = defineEnum('SyncDirection', ['INBOUND', 'OUTBOUND', 'BIDIRECTIONAL']);
const SyncStatusSchemaEnum = defineEnum('SyncStatus', ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED']);
const MappingTypeSchemaEnum = defineEnum('MappingType', ['DIRECT', 'TRANSFORM', 'LOOKUP', 'CONSTANT', 'COMPUTED']);

// ============ Schemas ============

export const IntegrationModel = defineSchemaModel({
  name: 'IntegrationModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    provider: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: IntegrationStatusSchemaEnum, isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ConnectionModel = defineSchemaModel({
  name: 'ConnectionModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    integrationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ConnectionStatusSchemaEnum, isOptional: false },
    authType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    externalAccountName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    connectedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    lastHealthCheck: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    healthStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const FieldMappingModel = defineSchemaModel({
  name: 'FieldMappingModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceField: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetField: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mappingType: { type: MappingTypeSchemaEnum, isOptional: false },
    transformExpression: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isRequired: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: false },
  },
});

export const SyncConfigModel = defineSchemaModel({
  name: 'SyncConfigModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    integrationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    direction: { type: SyncDirectionSchemaEnum, isOptional: false },
    sourceObject: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetObject: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduleEnabled: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: false },
    scheduleCron: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isActive: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: false },
    lastSyncAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    fieldMappings: { type: FieldMappingModel, isArray: true, isOptional: true },
  },
});

export const SyncRunModel = defineSchemaModel({
  name: 'SyncRunModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: SyncStatusSchemaEnum, isOptional: false },
    direction: { type: SyncDirectionSchemaEnum, isOptional: false },
    trigger: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recordsProcessed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    recordsCreated: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    recordsUpdated: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    recordsFailed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Input Models ============

export const CreateIntegrationInputModel = defineSchemaModel({
  name: 'CreateIntegrationInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    provider: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    config: { type: ScalarTypeEnum.JSON(), isOptional: true },
    featureFlagKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const CreateConnectionInputModel = defineSchemaModel({
  name: 'CreateConnectionInput',
  fields: {
    integrationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    authType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    credentials: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const CreateSyncConfigInputModel = defineSchemaModel({
  name: 'CreateSyncConfigInput',
  fields: {
    integrationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    direction: { type: SyncDirectionSchemaEnum, isOptional: false },
    sourceObject: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    targetObject: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    scheduleEnabled: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: true },
    scheduleCron: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const AddFieldMappingInputModel = defineSchemaModel({
  name: 'AddFieldMappingInput',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceField: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    targetField: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    mappingType: { type: MappingTypeSchemaEnum, isOptional: false },
    transformExpression: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    lookupConfig: { type: ScalarTypeEnum.JSON(), isOptional: true },
    constantValue: { type: ScalarTypeEnum.JSON(), isOptional: true },
    isRequired: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: true },
    defaultValue: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const TriggerSyncInputModel = defineSchemaModel({
  name: 'TriggerSyncInput',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    direction: { type: SyncDirectionSchemaEnum, isOptional: true },
    fullSync: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: true },
  },
});

export const ListSyncRunsInputModel = defineSchemaModel({
  name: 'ListSyncRunsInput',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: SyncStatusSchemaEnum, isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 20 },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 0 },
  },
});

export const ListSyncRunsOutputModel = defineSchemaModel({
  name: 'ListSyncRunsOutput',
  fields: {
    runs: { type: SyncRunModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

export const CreateIntegrationContract = defineCommand({
  meta: {
    name: 'integration.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'create'],
    description: 'Create a new integration.',
    goal: 'Allow users to set up integrations with external systems.',
    context: 'Integration setup.',
  },
  io: { input: CreateIntegrationInputModel, output: IntegrationModel },
  policy: { auth: 'user', roles: ['admin', 'integration_admin'] },
  sideEffects: {
    emits: [{ name: 'integration.created', version: 1, when: 'Integration created', payload: IntegrationModel }],
    audit: ['integration.created'],
  },
});

export const CreateConnectionContract = defineCommand({
  meta: {
    name: 'integration.connection.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'connection', 'create'],
    description: 'Create a connection to an external system.',
    goal: 'Authenticate with external systems.',
    context: 'Connection setup.',
  },
  io: { input: CreateConnectionInputModel, output: ConnectionModel },
  policy: { auth: 'user', roles: ['admin', 'integration_admin'] },
  sideEffects: {
    emits: [{ name: 'integration.connection.created', version: 1, when: 'Connection created', payload: ConnectionModel }],
    audit: ['integration.connection.created'],
  },
});

export const CreateSyncConfigContract = defineCommand({
  meta: {
    name: 'integration.syncConfig.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'sync', 'config', 'create'],
    description: 'Create a sync configuration.',
    goal: 'Define how data should be synchronized.',
    context: 'Sync setup.',
  },
  io: { input: CreateSyncConfigInputModel, output: SyncConfigModel },
  policy: { auth: 'user', roles: ['admin', 'integration_admin'] },
  sideEffects: {
    emits: [{ name: 'integration.syncConfig.created', version: 1, when: 'Sync config created', payload: SyncConfigModel }],
    audit: ['integration.syncConfig.created'],
  },
});

export const AddFieldMappingContract = defineCommand({
  meta: {
    name: 'integration.fieldMapping.add',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'mapping', 'field'],
    description: 'Add a field mapping to a sync config.',
    goal: 'Map fields between systems.',
    context: 'Mapping configuration.',
  },
  io: { input: AddFieldMappingInputModel, output: FieldMappingModel },
  policy: { auth: 'user', roles: ['admin', 'integration_admin'] },
  sideEffects: {
    emits: [{ name: 'integration.fieldMapping.added', version: 1, when: 'Mapping added', payload: FieldMappingModel }],
  },
});

export const TriggerSyncContract = defineCommand({
  meta: {
    name: 'integration.sync.trigger',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'sync', 'trigger'],
    description: 'Trigger a manual sync.',
    goal: 'Start data synchronization.',
    context: 'Manual sync or webhook trigger.',
  },
  io: { input: TriggerSyncInputModel, output: SyncRunModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [{ name: 'integration.sync.started', version: 1, when: 'Sync starts', payload: SyncRunModel }],
    audit: ['integration.sync.triggered'],
    jobs: [{ name: 'integration.sync.execute', when: 'Sync triggered' }],
  },
});

export const ListSyncRunsContract = defineQuery({
  meta: {
    name: 'integration.syncRun.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'sync', 'run', 'list'],
    description: 'List sync run history.',
    goal: 'View sync history and status.',
    context: 'Sync monitoring.',
  },
  io: { input: ListSyncRunsInputModel, output: ListSyncRunsOutputModel },
  policy: { auth: 'user' },
});


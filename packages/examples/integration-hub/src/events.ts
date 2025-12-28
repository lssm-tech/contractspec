import { defineEvent } from '@contractspec/lib.contracts';
import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';

// Integration events
const IntegrationCreatedPayload = defineSchemaModel({
  name: 'IntegrationCreatedPayload',
  description: 'Payload when an integration is created',
  fields: {
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const IntegrationCreatedEvent = defineEvent({
  meta: {
    key: 'integration.created',
    version: 1,
    description: 'Fired when a new integration is created',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration'],
  },
  payload: IntegrationCreatedPayload,
});

// Connection events
const ConnectionCreatedPayload = defineSchemaModel({
  name: 'ConnectionCreatedPayload',
  description: 'Payload when a connection is established',
  fields: {
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ConnectionCreatedEvent = defineEvent({
  meta: {
    key: 'integration.connection.created',
    version: 1,
    description: 'Fired when a new connection is established',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration', 'connection'],
  },
  payload: ConnectionCreatedPayload,
});

const ConnectionStatusChangedPayload = defineSchemaModel({
  name: 'ConnectionStatusChangedPayload',
  description: 'Payload when a connection status changes',
  fields: {
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ConnectionStatusChangedEvent = defineEvent({
  meta: {
    key: 'integration.connection.statusChanged',
    version: 1,
    description: 'Fired when a connection status changes',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration', 'connection'],
  },
  payload: ConnectionStatusChangedPayload,
});

// Sync config events
const SyncConfigCreatedPayload = defineSchemaModel({
  name: 'SyncConfigCreatedPayload',
  description: 'Payload when a sync configuration is created',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const SyncConfigCreatedEvent = defineEvent({
  meta: {
    key: 'integration.syncConfig.created',
    version: 1,
    description: 'Fired when a sync configuration is created',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration', 'sync'],
  },
  payload: SyncConfigCreatedPayload,
});

// Sync run events
const SyncStartedPayload = defineSchemaModel({
  name: 'SyncStartedPayload',
  description: 'Payload when a sync run starts',
  fields: {
    syncRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const SyncStartedEvent = defineEvent({
  meta: {
    key: 'integration.sync.started',
    version: 1,
    description: 'Fired when a sync run starts',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration', 'sync'],
  },
  payload: SyncStartedPayload,
});

const SyncCompletedPayload = defineSchemaModel({
  name: 'SyncCompletedPayload',
  description: 'Payload when a sync run completes successfully',
  fields: {
    syncRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recordsProcessed: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const SyncCompletedEvent = defineEvent({
  meta: {
    key: 'integration.sync.completed',
    version: 1,
    description: 'Fired when a sync run completes successfully',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration', 'sync'],
  },
  payload: SyncCompletedPayload,
});

const SyncFailedPayload = defineSchemaModel({
  name: 'SyncFailedPayload',
  description: 'Payload when a sync run fails',
  fields: {
    syncRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    error: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    failedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const SyncFailedEvent = defineEvent({
  meta: {
    key: 'integration.sync.failed',
    version: 1,
    description: 'Fired when a sync run fails',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration', 'sync'],
  },
  payload: SyncFailedPayload,
});

const RecordSyncedPayload = defineSchemaModel({
  name: 'RecordSyncedPayload',
  description: 'Payload when a single record is synced',
  fields: {
    syncRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recordId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const RecordSyncedEvent = defineEvent({
  meta: {
    key: 'integration.record.synced',
    version: 1,
    description: 'Fired when a single record is synced',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration', 'sync'],
  },
  payload: RecordSyncedPayload,
});

const FieldMappingAddedPayload = defineSchemaModel({
  name: 'FieldMappingAddedPayload',
  description: 'Payload when a field mapping is added to a sync config',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceField: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetField: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const FieldMappingAddedEvent = defineEvent({
  meta: {
    key: 'integration.fieldMapping.added',
    version: 1,
    description: 'Fired when a field mapping is added to a sync config',
    stability: 'experimental',
    owners: ['@integration-team'],
    tags: ['integration', 'sync'],
  },
  payload: FieldMappingAddedPayload,
});

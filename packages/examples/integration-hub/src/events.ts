import { defineEvent } from '@lssm/lib.contracts';
import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';

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
  name: 'integration.created',
  version: 1,
  description: 'Fired when a new integration is created',
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
  name: 'integration.connection.created',
  version: 1,
  description: 'Fired when a new connection is established',
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
  name: 'integration.connection.statusChanged',
  version: 1,
  description: 'Fired when a connection status changes',
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
  name: 'integration.syncConfig.created',
  version: 1,
  description: 'Fired when a sync configuration is created',
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
  name: 'integration.sync.started',
  version: 1,
  description: 'Fired when a sync run starts',
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
  name: 'integration.sync.completed',
  version: 1,
  description: 'Fired when a sync run completes successfully',
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
  name: 'integration.sync.failed',
  version: 1,
  description: 'Fired when a sync run fails',
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
  name: 'integration.record.synced',
  version: 1,
  description: 'Fired when a single record is synced',
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
  name: 'integration.fieldMapping.added',
  version: 1,
  description: 'Fired when a field mapping is added to a sync config',
  payload: FieldMappingAddedPayload,
});

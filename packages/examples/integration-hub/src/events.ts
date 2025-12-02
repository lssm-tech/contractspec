import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

// ============ Event Payloads ============

const IntegrationCreatedPayload = defineSchemaModel({
  name: 'IntegrationCreatedEventPayload',
  fields: {
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    provider: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ConnectionCreatedPayload = defineSchemaModel({
  name: 'ConnectionCreatedEventPayload',
  fields: {
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    authType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ConnectionStatusChangedPayload = defineSchemaModel({
  name: 'ConnectionStatusChangedEventPayload',
  fields: {
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    previousStatus: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const SyncConfigCreatedPayload = defineSchemaModel({
  name: 'SyncConfigCreatedEventPayload',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceObject: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetObject: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const SyncStartedPayload = defineSchemaModel({
  name: 'SyncStartedEventPayload',
  fields: {
    syncRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    direction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    trigger: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const SyncCompletedPayload = defineSchemaModel({
  name: 'SyncCompletedEventPayload',
  fields: {
    syncRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recordsProcessed: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    recordsCreated: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    recordsUpdated: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    recordsFailed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const SyncFailedPayload = defineSchemaModel({
  name: 'SyncFailedEventPayload',
  fields: {
    syncRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recordsProcessed: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const RecordSyncedPayload = defineSchemaModel({
  name: 'RecordSyncedEventPayload',
  fields: {
    syncRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    operation: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Events ============

export const IntegrationCreatedEvent = defineEvent({
  name: 'integration.created',
  version: 1,
  description: 'A new integration has been created.',
  payload: IntegrationCreatedPayload,
});

export const ConnectionCreatedEvent = defineEvent({
  name: 'integration.connection.created',
  version: 1,
  description: 'A new connection has been created.',
  payload: ConnectionCreatedPayload,
});

export const ConnectionStatusChangedEvent = defineEvent({
  name: 'integration.connection.statusChanged',
  version: 1,
  description: 'A connection status has changed.',
  payload: ConnectionStatusChangedPayload,
});

export const SyncConfigCreatedEvent = defineEvent({
  name: 'integration.syncConfig.created',
  version: 1,
  description: 'A sync configuration has been created.',
  payload: SyncConfigCreatedPayload,
});

export const SyncStartedEvent = defineEvent({
  name: 'integration.sync.started',
  version: 1,
  description: 'A sync has started.',
  payload: SyncStartedPayload,
});

export const SyncCompletedEvent = defineEvent({
  name: 'integration.sync.completed',
  version: 1,
  description: 'A sync has completed.',
  payload: SyncCompletedPayload,
});

export const SyncFailedEvent = defineEvent({
  name: 'integration.sync.failed',
  version: 1,
  description: 'A sync has failed.',
  payload: SyncFailedPayload,
});

export const RecordSyncedEvent = defineEvent({
  name: 'integration.record.synced',
  version: 1,
  description: 'A record has been synced.',
  payload: RecordSyncedPayload,
});

// ============ All Events ============

export const IntegrationHubEvents = {
  IntegrationCreatedEvent,
  ConnectionCreatedEvent,
  ConnectionStatusChangedEvent,
  SyncConfigCreatedEvent,
  SyncStartedEvent,
  SyncCompletedEvent,
  SyncFailedEvent,
  RecordSyncedEvent,
};

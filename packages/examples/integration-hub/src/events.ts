import { defineEvent } from '@lssm/lib.contracts';
import { z } from 'zod';

// Integration events
export const IntegrationCreatedEvent = defineEvent({
  meta: {
    name: 'integration.created',
    version: 1,
    description: 'Fired when a new integration is created',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'lifecycle'],
  },
  payload: z.object({
    integrationId: z.string(),
    type: z.string(),
    createdAt: z.string(),
  }),
});

// Connection events
export const ConnectionCreatedEvent = defineEvent({
  meta: {
    name: 'integration.connection.created',
    version: 1,
    description: 'Fired when a new connection is established',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['connection', 'lifecycle'],
  },
  payload: z.object({
    connectionId: z.string(),
    integrationId: z.string(),
    status: z.string(),
    createdAt: z.string(),
  }),
});

export const ConnectionStatusChangedEvent = defineEvent({
  meta: {
    name: 'integration.connection.statusChanged',
    version: 1,
    description: 'Fired when a connection status changes',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['connection', 'status'],
  },
  payload: z.object({
    connectionId: z.string(),
    previousStatus: z.string(),
    newStatus: z.string(),
    changedAt: z.string(),
  }),
});

// Sync config events
export const SyncConfigCreatedEvent = defineEvent({
  meta: {
    name: 'integration.syncConfig.created',
    version: 1,
    description: 'Fired when a sync configuration is created',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['sync', 'config', 'lifecycle'],
  },
  payload: z.object({
    syncConfigId: z.string(),
    connectionId: z.string(),
    createdAt: z.string(),
  }),
});

// Sync run events
export const SyncStartedEvent = defineEvent({
  meta: {
    name: 'integration.sync.started',
    version: 1,
    description: 'Fired when a sync run starts',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['sync', 'run', 'lifecycle'],
  },
  payload: z.object({
    syncRunId: z.string(),
    syncConfigId: z.string(),
    startedAt: z.string(),
  }),
});

export const SyncCompletedEvent = defineEvent({
  meta: {
    name: 'integration.sync.completed',
    version: 1,
    description: 'Fired when a sync run completes successfully',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['sync', 'run', 'lifecycle'],
  },
  payload: z.object({
    syncRunId: z.string(),
    syncConfigId: z.string(),
    recordsProcessed: z.number(),
    completedAt: z.string(),
  }),
});

export const SyncFailedEvent = defineEvent({
  meta: {
    name: 'integration.sync.failed',
    version: 1,
    description: 'Fired when a sync run fails',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['sync', 'run', 'error'],
  },
  payload: z.object({
    syncRunId: z.string(),
    syncConfigId: z.string(),
    error: z.string(),
    failedAt: z.string(),
  }),
});

export const RecordSyncedEvent = defineEvent({
  meta: {
    name: 'integration.record.synced',
    version: 1,
    description: 'Fired when a single record is synced',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['sync', 'record'],
  },
  payload: z.object({
    syncRunId: z.string(),
    recordId: z.string(),
    sourceId: z.string(),
    targetId: z.string(),
  }),
});

export const FieldMappingAddedEvent = defineEvent({
  meta: {
    name: 'integration.fieldMapping.added',
    version: 1,
    description: 'Fired when a field mapping is added to a sync config',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['sync', 'config', 'mapping'],
  },
  payload: z.object({
    syncConfigId: z.string(),
    sourceField: z.string(),
    targetField: z.string(),
  }),
});


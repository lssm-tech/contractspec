import { defineCommand, defineQuery } from '@lssm/lib.contracts/operation';
import {
  SyncConfigModel,
  SyncRunModel,
  FieldMappingModel,
  CreateSyncConfigInputModel,
  AddFieldMappingInputModel,
  TriggerSyncInputModel,
  ListSyncRunsInputModel,
  ListSyncRunsOutputModel,
} from './sync.schema';

const OWNERS = ['@example.integration-hub'] as const;

/**
 * Create a sync configuration.
 */
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
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        name: 'integration.syncConfig.created',
        version: 1,
        when: 'Sync config created',
        payload: SyncConfigModel,
      },
    ],
    audit: ['integration.syncConfig.created'],
  },
});

/**
 * Add a field mapping to a sync config.
 */
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
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        name: 'integration.fieldMapping.added',
        version: 1,
        when: 'Mapping added',
        payload: FieldMappingModel,
      },
    ],
  },
});

/**
 * Trigger a manual sync.
 */
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
    emits: [
      {
        name: 'integration.sync.started',
        version: 1,
        when: 'Sync starts',
        payload: SyncRunModel,
      },
    ],
    audit: ['integration.sync.triggered'],
  },
});

/**
 * List sync run history.
 */
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

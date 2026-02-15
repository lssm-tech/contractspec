import {
  defineCommand,
  defineQuery,
} from '@contractspec/lib.contracts-spec/operations';
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
    key: 'integration.syncConfig.create',
    version: '1.0.0',
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
        key: 'integration.syncConfig.created',
        version: '1.0.0',
        when: 'Sync config created',
        payload: SyncConfigModel,
      },
    ],
    audit: ['integration.syncConfig.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-sync-happy-path',
        given: ['User is authenticated'],
        when: ['User creates sync config'],
        then: ['Sync config is created', 'SyncConfigCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'create-contact-sync',
        input: {
          name: 'Contacts Sync',
          sourceConnectionId: 'conn-1',
          targetConnectionId: 'conn-2',
        },
        output: { id: 'sync-123', status: 'active' },
      },
    ],
  },
});

/**
 * Add a field mapping to a sync config.
 */
export const AddFieldMappingContract = defineCommand({
  meta: {
    key: 'integration.fieldMapping.add',
    version: '1.0.0',
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
        key: 'integration.fieldMapping.added',
        version: '1.0.0',
        when: 'Mapping added',
        payload: FieldMappingModel,
      },
    ],
  },
  acceptance: {
    scenarios: [
      {
        key: 'add-mapping-happy-path',
        given: ['Sync config exists'],
        when: ['User adds field mapping'],
        then: ['Mapping is added', 'FieldMappingAdded event is emitted'],
      },
    ],
    examples: [
      {
        key: 'map-email',
        input: {
          syncConfigId: 'sync-123',
          sourceField: 'email',
          targetField: 'user_email',
        },
        output: { id: 'map-456', type: 'string' },
      },
    ],
  },
});

/**
 * Trigger a manual sync.
 */
export const TriggerSyncContract = defineCommand({
  meta: {
    key: 'integration.sync.trigger',
    version: '1.0.0',
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
        key: 'integration.sync.started',
        version: '1.0.0',
        when: 'Sync starts',
        payload: SyncRunModel,
      },
    ],
    audit: ['integration.sync.triggered'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'trigger-sync-happy-path',
        given: ['Sync config exists'],
        when: ['User triggers sync'],
        then: ['Sync run starts', 'SyncStarted event is emitted'],
      },
    ],
    examples: [
      {
        key: 'manual-trigger',
        input: { syncConfigId: 'sync-123' },
        output: { id: 'run-789', status: 'pending' },
      },
    ],
  },
});

/**
 * List sync run history.
 */
export const ListSyncRunsContract = defineQuery({
  meta: {
    key: 'integration.syncRun.list',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'sync', 'run', 'list'],
    description: 'List sync run history.',
    goal: 'View sync history and status.',
    context: 'Sync monitoring.',
  },
  io: { input: ListSyncRunsInputModel, output: ListSyncRunsOutputModel },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'list-runs-happy-path',
        given: ['User has access to syncs'],
        when: ['User lists sync runs'],
        then: ['List of runs is returned'],
      },
    ],
    examples: [
      {
        key: 'list-recent',
        input: { limit: 10 },
        output: { items: [], total: 50 },
      },
    ],
  },
});

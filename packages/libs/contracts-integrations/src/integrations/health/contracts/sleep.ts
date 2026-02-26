import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  defineCommand,
  defineQuery,
  type AnyOperationSpec,
} from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { HealthSleepRecord } from '../models';
import { HEALTH_TELEMETRY_EVENTS } from '../telemetry';

const HealthListSleepInput = new SchemaModel({
  name: 'HealthListSleepInput',
  description: 'Parameters for listing normalized sleep intervals.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    cursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    pageSize: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const HealthListSleepOutput = new SchemaModel({
  name: 'HealthListSleepOutput',
  description: 'Paginated list of normalized sleep intervals.',
  fields: {
    sleep: {
      type: HealthSleepRecord,
      isArray: true,
      isOptional: false,
    },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const HealthSyncSleepInput = new SchemaModel({
  name: 'HealthSyncSleepInput',
  description: 'Command payload to synchronize sleep intervals.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    cursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    forceFullRefresh: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const HealthSyncSleepOutput = new SchemaModel({
  name: 'HealthSyncSleepOutput',
  description: 'Result of a sleep synchronization run.',
  fields: {
    synced: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    failed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    errors: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

export const HealthListSleep = defineQuery({
  meta: {
    key: 'health.sleep.list',
    version: '1.0.0',
    description:
      'List normalized sleep intervals synced from health providers.',
    goal: 'Provide canonical sleep data for recovery and coaching workflows.',
    context: 'Used by sleep insights, readiness scoring, and trend reporting.',
    owners: ['@platform.integrations'],
    tags: ['health', 'sleep', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthListSleepInput,
    output: HealthListSleepOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const HealthSyncSleep = defineCommand({
  meta: {
    key: 'health.sleep.sync',
    version: '1.0.0',
    description: 'Synchronize sleep intervals from connected providers.',
    goal: 'Keep canonical sleep records aligned with upstream provider data.',
    context:
      'Triggered by scheduled jobs or manual refresh in health surfaces.',
    owners: ['@platform.integrations'],
    tags: ['health', 'sleep', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthSyncSleepInput,
    output: HealthSyncSleepOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: HEALTH_TELEMETRY_EVENTS.sleepSynced },
    },
    failure: {
      event: { key: HEALTH_TELEMETRY_EVENTS.sleepSyncFailed },
    },
  },
});

export const healthSleepContracts: Record<string, AnyOperationSpec> = {
  HealthListSleep,
  HealthSyncSleep,
};

export function registerHealthSleepContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry.register(HealthListSleep).register(HealthSyncSleep);
}

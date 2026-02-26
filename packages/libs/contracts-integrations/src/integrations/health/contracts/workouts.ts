import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  defineCommand,
  defineQuery,
  type AnyOperationSpec,
} from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { HealthWorkoutRecord } from '../models';
import { HEALTH_TELEMETRY_EVENTS } from '../telemetry';

const HealthListWorkoutsInput = new SchemaModel({
  name: 'HealthListWorkoutsInput',
  description: 'Parameters for listing normalized workout entries.',
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

const HealthListWorkoutsOutput = new SchemaModel({
  name: 'HealthListWorkoutsOutput',
  description: 'Paginated list of normalized workouts.',
  fields: {
    workouts: {
      type: HealthWorkoutRecord,
      isArray: true,
      isOptional: false,
    },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const HealthSyncWorkoutsInput = new SchemaModel({
  name: 'HealthSyncWorkoutsInput',
  description: 'Command payload to synchronize workouts.',
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

const HealthSyncWorkoutsOutput = new SchemaModel({
  name: 'HealthSyncWorkoutsOutput',
  description: 'Result of a workout synchronization run.',
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

export const HealthListWorkouts = defineQuery({
  meta: {
    key: 'health.workouts.list',
    version: '1.0.0',
    description:
      'List normalized workout entries synced from health integrations.',
    goal: 'Provide canonical workout history across connected providers.',
    context:
      'Used by training plans, progress analytics, and recovery workflows.',
    owners: ['@platform.integrations'],
    tags: ['health', 'workouts', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthListWorkoutsInput,
    output: HealthListWorkoutsOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const HealthSyncWorkouts = defineCommand({
  meta: {
    key: 'health.workouts.sync',
    version: '1.0.0',
    description: 'Synchronize workouts from configured health providers.',
    goal: 'Keep canonical workout records fresh for downstream experiences.',
    context: 'Triggered by background sync jobs and manual refresh actions.',
    owners: ['@platform.integrations'],
    tags: ['health', 'workouts', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthSyncWorkoutsInput,
    output: HealthSyncWorkoutsOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: HEALTH_TELEMETRY_EVENTS.workoutsSynced },
    },
    failure: {
      event: { key: HEALTH_TELEMETRY_EVENTS.workoutsSyncFailed },
    },
  },
});

export const healthWorkoutContracts: Record<string, AnyOperationSpec> = {
  HealthListWorkouts,
  HealthSyncWorkouts,
};

export function registerHealthWorkoutContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry.register(HealthListWorkouts).register(HealthSyncWorkouts);
}

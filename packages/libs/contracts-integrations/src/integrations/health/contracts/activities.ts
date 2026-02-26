import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  defineCommand,
  defineQuery,
  type AnyOperationSpec,
} from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { HealthActivityRecord } from '../models';
import { HEALTH_TELEMETRY_EVENTS } from '../telemetry';

const HealthListActivitiesInput = new SchemaModel({
  name: 'HealthListActivitiesInput',
  description: 'Parameters for listing normalized activity entries.',
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

const HealthListActivitiesOutput = new SchemaModel({
  name: 'HealthListActivitiesOutput',
  description: 'Paginated list of normalized activities.',
  fields: {
    activities: {
      type: HealthActivityRecord,
      isArray: true,
      isOptional: false,
    },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const HealthSyncActivitiesInput = new SchemaModel({
  name: 'HealthSyncActivitiesInput',
  description: 'Command payload to trigger provider activity synchronization.',
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

const HealthSyncActivitiesOutput = new SchemaModel({
  name: 'HealthSyncActivitiesOutput',
  description: 'Result of an activity synchronization run.',
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

export const HealthListActivities = defineQuery({
  meta: {
    key: 'health.activities.list',
    version: '1.0.0',
    description:
      'List normalized activity entries synced from health integrations.',
    goal: 'Provide app workflows with canonical activity data across providers and transports.',
    context:
      'Used by analytics dashboards, coaching workflows, and health summaries.',
    owners: ['@platform.integrations'],
    tags: ['health', 'activities', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthListActivitiesInput,
    output: HealthListActivitiesOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const HealthSyncActivities = defineCommand({
  meta: {
    key: 'health.activities.sync',
    version: '1.0.0',
    description:
      'Synchronize activity entries from the configured health provider.',
    goal: 'Keep canonical activity records aligned with upstream provider sources.',
    context:
      'Triggered by scheduled jobs or manual refresh actions to maintain incremental sync state.',
    owners: ['@platform.integrations'],
    tags: ['health', 'activities', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthSyncActivitiesInput,
    output: HealthSyncActivitiesOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: HEALTH_TELEMETRY_EVENTS.activitiesSynced },
    },
    failure: {
      event: { key: HEALTH_TELEMETRY_EVENTS.activitiesSyncFailed },
    },
  },
});

export const healthActivityContracts: Record<string, AnyOperationSpec> = {
  HealthListActivities,
  HealthSyncActivities,
};

export function registerHealthActivityContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry.register(HealthListActivities).register(HealthSyncActivities);
}

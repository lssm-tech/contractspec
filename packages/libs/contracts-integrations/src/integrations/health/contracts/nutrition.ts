import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  defineCommand,
  defineQuery,
  type AnyOperationSpec,
} from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { HealthNutritionRecord } from '../models';
import { HEALTH_TELEMETRY_EVENTS } from '../telemetry';

const HealthListNutritionInput = new SchemaModel({
  name: 'HealthListNutritionInput',
  description: 'Parameters for listing nutrition and hydration logs.',
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

const HealthListNutritionOutput = new SchemaModel({
  name: 'HealthListNutritionOutput',
  description: 'Paginated list of normalized nutrition records.',
  fields: {
    nutrition: {
      type: HealthNutritionRecord,
      isArray: true,
      isOptional: false,
    },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const HealthSyncNutritionInput = new SchemaModel({
  name: 'HealthSyncNutritionInput',
  description: 'Command payload to synchronize nutrition records.',
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

const HealthSyncNutritionOutput = new SchemaModel({
  name: 'HealthSyncNutritionOutput',
  description: 'Result of a nutrition synchronization run.',
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

export const HealthListNutrition = defineQuery({
  meta: {
    key: 'health.nutrition.list',
    version: '1.0.0',
    description:
      'List normalized nutrition and hydration records from connected providers.',
    goal: 'Provide canonical nutrition data for health goals, coaching, and analytics.',
    context:
      'Used by nutrition reporting, diet workflows, and aggregate health views.',
    owners: ['@platform.integrations'],
    tags: ['health', 'nutrition', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthListNutritionInput,
    output: HealthListNutritionOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const HealthSyncNutrition = defineCommand({
  meta: {
    key: 'health.nutrition.sync',
    version: '1.0.0',
    description: 'Synchronize nutrition records from provider sources.',
    goal: 'Keep canonical nutrition records synchronized across connectors.',
    context: 'Triggered by incremental sync jobs and manual refresh actions.',
    owners: ['@platform.integrations'],
    tags: ['health', 'nutrition', 'wearables'],
    stability: 'experimental',
  },
  io: {
    input: HealthSyncNutritionInput,
    output: HealthSyncNutritionOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: HEALTH_TELEMETRY_EVENTS.nutritionSynced },
    },
    failure: {
      event: { key: HEALTH_TELEMETRY_EVENTS.nutritionSyncFailed },
    },
  },
});

export const healthNutritionContracts: Record<string, AnyOperationSpec> = {
  HealthListNutrition,
  HealthSyncNutrition,
};

export function registerHealthNutritionContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry.register(HealthListNutrition).register(HealthSyncNutrition);
}

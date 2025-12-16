import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { SyncDirectionEnum, SyncStatusEnum, MappingTypeEnum } from './sync.enum';

/**
 * A field mapping configuration.
 */
export const FieldMappingModel = defineSchemaModel({
  name: 'FieldMappingModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceField: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetField: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mappingType: { type: MappingTypeEnum, isOptional: false },
    transformExpression: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    isRequired: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

/**
 * A sync configuration.
 */
export const SyncConfigModel = defineSchemaModel({
  name: 'SyncConfigModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    direction: { type: SyncDirectionEnum, isOptional: false },
    sourceObject: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetObject: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduleEnabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    scheduleCron: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isActive: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    lastSyncAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    fieldMappings: { type: FieldMappingModel, isArray: true, isOptional: true },
  },
});

/**
 * A sync run.
 */
export const SyncRunModel = defineSchemaModel({
  name: 'SyncRunModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: SyncStatusEnum, isOptional: false },
    direction: { type: SyncDirectionEnum, isOptional: false },
    trigger: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recordsProcessed: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    recordsCreated: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    recordsUpdated: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    recordsFailed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a sync config.
 */
export const CreateSyncConfigInputModel = defineSchemaModel({
  name: 'CreateSyncConfigInput',
  fields: {
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    connectionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    direction: { type: SyncDirectionEnum, isOptional: false },
    sourceObject: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    targetObject: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    scheduleEnabled: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    scheduleCron: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for adding a field mapping.
 */
export const AddFieldMappingInputModel = defineSchemaModel({
  name: 'AddFieldMappingInput',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceField: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    targetField: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    mappingType: { type: MappingTypeEnum, isOptional: false },
    transformExpression: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    lookupConfig: { type: ScalarTypeEnum.JSON(), isOptional: true },
    constantValue: { type: ScalarTypeEnum.JSON(), isOptional: true },
    isRequired: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    defaultValue: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

/**
 * Input for triggering a sync.
 */
export const TriggerSyncInputModel = defineSchemaModel({
  name: 'TriggerSyncInput',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    direction: { type: SyncDirectionEnum, isOptional: true },
    fullSync: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

/**
 * Input for listing sync runs.
 */
export const ListSyncRunsInputModel = defineSchemaModel({
  name: 'ListSyncRunsInput',
  fields: {
    syncConfigId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: SyncStatusEnum, isOptional: true },
    limit: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 20,
    },
    offset: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 0,
    },
  },
});

/**
 * Output for listing sync runs.
 */
export const ListSyncRunsOutputModel = defineSchemaModel({
  name: 'ListSyncRunsOutput',
  fields: {
    runs: { type: SyncRunModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});



import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { QueryTypeEnum } from './query.enum';

/**
 * A data query.
 */
export const QueryModel = defineSchemaModel({
  name: 'QueryModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: QueryTypeEnum, isOptional: false },
    definition: { type: ScalarTypeEnum.JSON(), isOptional: false },
    sql: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    cacheTtlSeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    isShared: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Query execution result.
 */
export const QueryResultModel = defineSchemaModel({
  name: 'QueryResultModel',
  fields: {
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    data: { type: ScalarTypeEnum.JSON(), isOptional: false },
    columns: { type: ScalarTypeEnum.JSON(), isOptional: false },
    rowCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    executionTimeMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    cachedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    error: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for creating a query.
 */
export const CreateQueryInputModel = defineSchemaModel({
  name: 'CreateQueryInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: QueryTypeEnum, isOptional: false },
    definition: { type: ScalarTypeEnum.JSON(), isOptional: false },
    sql: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metricIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    cacheTtlSeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    isShared: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

/**
 * Input for executing a query.
 */
export const ExecuteQueryInputModel = defineSchemaModel({
  name: 'ExecuteQueryInput',
  fields: {
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    parameters: { type: ScalarTypeEnum.JSON(), isOptional: true },
    dateRange: { type: ScalarTypeEnum.JSON(), isOptional: true },
    filters: { type: ScalarTypeEnum.JSON(), isOptional: true },
    forceRefresh: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

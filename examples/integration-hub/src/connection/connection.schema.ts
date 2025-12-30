import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { ConnectionStatusEnum } from './connection.enum';

/**
 * A connection to an external system.
 */
export const ConnectionModel = defineSchemaModel({
  name: 'ConnectionModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ConnectionStatusEnum, isOptional: false },
    authType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    externalAccountName: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    connectedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    lastHealthCheck: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    healthStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for creating a connection.
 */
export const CreateConnectionInputModel = defineSchemaModel({
  name: 'CreateConnectionInput',
  fields: {
    integrationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    authType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    credentials: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

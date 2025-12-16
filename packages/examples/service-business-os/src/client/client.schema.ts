import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Client profile.
 */
export const ClientModel = defineSchemaModel({
  name: 'Client',
  description: 'Client profile',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    contactEmail: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    phone: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a client.
 */
export const CreateClientInputModel = defineSchemaModel({
  name: 'CreateClientInput',
  description: 'Input for creating a client',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    contactEmail: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    phone: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});





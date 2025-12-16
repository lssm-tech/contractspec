import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { IntegrationStatusEnum } from './integration.enum';

/**
 * An integration with an external system.
 */
export const IntegrationModel = defineSchemaModel({
  name: 'IntegrationModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    provider: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: IntegrationStatusEnum, isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating an integration.
 */
export const CreateIntegrationInputModel = defineSchemaModel({
  name: 'CreateIntegrationInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    provider: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    config: { type: ScalarTypeEnum.JSON(), isOptional: true },
    featureFlagKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

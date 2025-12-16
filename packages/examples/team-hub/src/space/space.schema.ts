import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Team space/project.
 */
export const SpaceModel = defineSchemaModel({
  name: 'Space',
  description: 'Team space/project',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Input for creating a space.
 */
export const CreateSpaceInputModel = defineSchemaModel({
  name: 'CreateSpaceInput',
  description: 'Input for creating a space',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});




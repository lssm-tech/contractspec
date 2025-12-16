import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { StoreStatusEnum } from './store.enum';

/**
 * A seller store.
 */
export const StoreModel = defineSchemaModel({
  name: 'StoreModel',
  description: 'A seller store',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: StoreStatusEnum, isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    logoFileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isVerified: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    totalProducts: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    averageRating: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a store.
 */
export const CreateStoreInputModel = defineSchemaModel({
  name: 'CreateStoreInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: true },
    country: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

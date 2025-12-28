import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { ProductStatusEnum } from './product.enum';

/**
 * A product listing.
 */
export const ProductModel = defineSchemaModel({
  name: 'ProductModel',
  description: 'A product listing',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ProductStatusEnum, isOptional: false },
    price: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    categoryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    primaryImageId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    averageRating: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    totalSold: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a product.
 */
export const CreateProductInputModel = defineSchemaModel({
  name: 'CreateProductInput',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    price: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    categoryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    sku: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for listing products.
 */
export const ListProductsInputModel = defineSchemaModel({
  name: 'ListProductsInput',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    categoryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ProductStatusEnum, isOptional: true },
    search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    minPrice: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    maxPrice: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
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
 * Output for listing products.
 */
export const ListProductsOutputModel = defineSchemaModel({
  name: 'ListProductsOutput',
  fields: {
    products: { type: ProductModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

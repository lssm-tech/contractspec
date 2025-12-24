import { defineCommand, defineQuery } from '@lssm/lib.contracts/operations';
import {
  CreateProductInputModel,
  ListProductsInputModel,
  ListProductsOutputModel,
  ProductModel,
} from './product.schema';

const OWNERS = ['@example.marketplace'] as const;

/**
 * Create a new product listing.
 */
export const CreateProductContract = defineCommand({
  meta: {
    name: 'marketplace.product.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'product', 'create'],
    description: 'Create a new product listing.',
    goal: 'Allow sellers to list products.',
    context: 'Product management.',
  },
  io: { input: CreateProductInputModel, output: ProductModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        name: 'marketplace.product.created',
        version: 1,
        when: 'Product is created',
        payload: ProductModel,
      },
    ],
    audit: ['marketplace.product.created'],
  },
});

/**
 * List products with filters.
 */
export const ListProductsContract = defineQuery({
  meta: {
    name: 'marketplace.product.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'product', 'list'],
    description: 'List products with filters.',
    goal: 'Browse products on the marketplace.',
    context: 'Product catalog, search.',
  },
  io: { input: ListProductsInputModel, output: ListProductsOutputModel },
  policy: { auth: 'anonymous' },
});

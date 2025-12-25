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
    key: 'marketplace.product.create',
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
        key: 'marketplace.product.created',
        version: 1,
        when: 'Product is created',
        payload: ProductModel,
      },
    ],
    audit: ['marketplace.product.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-product-happy-path',
        given: ['User is a seller'],
        when: ['User creates a product listing'],
        then: ['Product is created', 'ProductCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'create-t-shirt',
        input: { title: 'Classic T-Shirt', price: 25, stock: 100, storeId: 'store-123' },
        output: { id: 'prod-456', title: 'Classic T-Shirt', status: 'published' },
      },
    ],
  },
});

/**
 * List products with filters.
 */
export const ListProductsContract = defineQuery({
  meta: {
    key: 'marketplace.product.list',
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
  acceptance: {
    scenarios: [
      {
        key: 'list-products-happy-path',
        given: ['Products exist'],
        when: ['User searches for products'],
        then: ['List of products is returned'],
      },
    ],
    examples: [
      {
        key: 'search-t-shirts',
        input: { search: 't-shirt', limit: 20 },
        output: { items: [], total: 50, hasMore: true },
      },
    ],
  },
});

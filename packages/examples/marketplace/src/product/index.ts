/**
 * Product domain - Product listing management.
 */

export { ProductStatusEnum } from './product.enum';
export {
  ProductModel,
  CreateProductInputModel,
  ListProductsInputModel,
  ListProductsOutputModel,
} from './product.schema';
export {
  CreateProductContract,
  ListProductsContract,
} from './product.contracts';
export {
  ProductCreatedEvent,
  ProductPublishedEvent,
  InventoryUpdatedEvent,
} from './product.event';

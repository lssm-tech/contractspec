/**
 * Product domain - Product listing management.
 */

export { ProductStatusEnum } from './product.enum';
export {
	InventoryUpdatedEvent,
	ProductCreatedEvent,
	ProductPublishedEvent,
} from './product.event';
export {
	CreateProductContract,
	ListProductsContract,
} from './product.operations';
export {
	CreateProductInputModel,
	ListProductsInputModel,
	ListProductsOutputModel,
	ProductModel,
} from './product.schema';

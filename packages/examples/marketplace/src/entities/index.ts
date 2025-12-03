// Store entities
export {
  StoreStatusEnum,
  StoreTypeEnum,
  StoreEntity,
  StoreCategoryEntity,
} from './store';

// Product entities
export {
  ProductStatusEnum,
  ProductTypeEnum,
  ProductEntity,
  ProductVariantEntity,
  CategoryEntity,
} from './product';

// Order entities
export {
  OrderStatusEnum,
  PaymentStatusEnum,
  OrderEntity,
  OrderItemEntity,
  RefundEntity,
  RefundItemEntity,
} from './order';

// Payout entities
export {
  PayoutStatusEnum,
  PayoutScheduleEnum,
  PayoutEntity,
  PayoutItemEntity,
  BankAccountEntity,
  PayoutSettingsEntity,
} from './payout';

// Review entities
export {
  ReviewStatusEnum,
  ReviewTypeEnum,
  ReviewEntity,
  ReviewResponseEntity,
  ReviewVoteEntity,
  ReviewReportEntity,
} from './review';

// Schema contribution
import {
  StoreStatusEnum,
  StoreTypeEnum,
  StoreEntity,
  StoreCategoryEntity,
} from './store';
import {
  ProductStatusEnum,
  ProductTypeEnum,
  ProductEntity,
  ProductVariantEntity,
  CategoryEntity,
} from './product';
import {
  OrderStatusEnum,
  PaymentStatusEnum,
  OrderEntity,
  OrderItemEntity,
  RefundEntity,
  RefundItemEntity,
} from './order';
import {
  PayoutStatusEnum,
  PayoutScheduleEnum,
  PayoutEntity,
  PayoutItemEntity,
  BankAccountEntity,
  PayoutSettingsEntity,
} from './payout';
import {
  ReviewStatusEnum,
  ReviewTypeEnum,
  ReviewEntity,
  ReviewResponseEntity,
  ReviewVoteEntity,
  ReviewReportEntity,
} from './review';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

export const marketplaceEntities = [
  // Store
  StoreEntity,
  StoreCategoryEntity,

  // Product
  ProductEntity,
  ProductVariantEntity,
  CategoryEntity,

  // Order
  OrderEntity,
  OrderItemEntity,
  RefundEntity,
  RefundItemEntity,

  // Payout
  PayoutEntity,
  PayoutItemEntity,
  BankAccountEntity,
  PayoutSettingsEntity,

  // Review
  ReviewEntity,
  ReviewResponseEntity,
  ReviewVoteEntity,
  ReviewReportEntity,
];

export const marketplaceSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/example.marketplace',
  entities: marketplaceEntities,
  enums: [
    StoreStatusEnum,
    StoreTypeEnum,
    ProductStatusEnum,
    ProductTypeEnum,
    OrderStatusEnum,
    PaymentStatusEnum,
    PayoutStatusEnum,
    PayoutScheduleEnum,
    ReviewStatusEnum,
    ReviewTypeEnum,
  ],
};


// Store entities

// Order entities
export {
	OrderEntity,
	OrderItemEntity,
	OrderStatusEnum,
	PaymentStatusEnum,
	RefundEntity,
	RefundItemEntity,
} from './order';
// Payout entities
export {
	BankAccountEntity,
	PayoutEntity,
	PayoutItemEntity,
	PayoutScheduleEnum,
	PayoutSettingsEntity,
	PayoutStatusEnum,
} from './payout';
// Product entities
export {
	CategoryEntity,
	ProductEntity,
	ProductStatusEnum,
	ProductTypeEnum,
	ProductVariantEntity,
} from './product';
// Review entities
export {
	ReviewEntity,
	ReviewReportEntity,
	ReviewResponseEntity,
	ReviewStatusEnum,
	ReviewTypeEnum,
	ReviewVoteEntity,
} from './review';
export {
	StoreCategoryEntity,
	StoreEntity,
	StoreStatusEnum,
	StoreTypeEnum,
} from './store';

import type { ModuleSchemaContribution } from '@contractspec/lib.schema';
import {
	OrderEntity,
	OrderItemEntity,
	OrderStatusEnum,
	PaymentStatusEnum,
	RefundEntity,
	RefundItemEntity,
} from './order';
import {
	BankAccountEntity,
	PayoutEntity,
	PayoutItemEntity,
	PayoutScheduleEnum,
	PayoutSettingsEntity,
	PayoutStatusEnum,
} from './payout';
import {
	CategoryEntity,
	ProductEntity,
	ProductStatusEnum,
	ProductTypeEnum,
	ProductVariantEntity,
} from './product';
import {
	ReviewEntity,
	ReviewReportEntity,
	ReviewResponseEntity,
	ReviewStatusEnum,
	ReviewTypeEnum,
	ReviewVoteEntity,
} from './review';
// Schema contribution
import {
	StoreCategoryEntity,
	StoreEntity,
	StoreStatusEnum,
	StoreTypeEnum,
} from './store';

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
	moduleId: '@contractspec/example.marketplace',
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

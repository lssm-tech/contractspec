import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { PayoutStatusEnum } from './payout.enum';

/**
 * A payout to seller.
 */
export const PayoutModel = defineSchemaModel({
  name: 'PayoutModel',
  description: 'A payout to seller',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payoutNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: PayoutStatusEnum, isOptional: false },
    grossAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    platformFees: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    netAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    periodStart: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    periodEnd: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    orderCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    paidAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

/**
 * Input for listing payouts.
 */
export const ListPayoutsInputModel = defineSchemaModel({
  name: 'ListPayoutsInput',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: PayoutStatusEnum, isOptional: true },
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
 * Output for listing payouts.
 */
export const ListPayoutsOutputModel = defineSchemaModel({
  name: 'ListPayoutsOutput',
  fields: {
    payouts: { type: PayoutModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalPending: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

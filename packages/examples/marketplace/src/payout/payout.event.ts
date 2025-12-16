import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

const PayoutCreatedPayload = defineSchemaModel({
  name: 'PayoutCreatedEventPayload',
  fields: {
    payoutId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payoutNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    netAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const PayoutPaidPayload = defineSchemaModel({
  name: 'PayoutPaidEventPayload',
  fields: {
    payoutId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payoutNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    netAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    paymentReference: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const PayoutCreatedEvent = defineEvent({
  name: 'marketplace.payout.created',
  version: 1,
  description: 'A payout has been created.',
  payload: PayoutCreatedPayload,
});

export const PayoutPaidEvent = defineEvent({
  name: 'marketplace.payout.paid',
  version: 1,
  description: 'A payout has been sent.',
  payload: PayoutPaidPayload,
});



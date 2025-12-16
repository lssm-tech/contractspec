import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Payment applied to invoice.
 */
export const PaymentModel = defineSchemaModel({
  name: 'Payment',
  description: 'Payment applied to invoice',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    invoiceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    method: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reference: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for recording a payment.
 */
export const RecordPaymentInputModel = defineSchemaModel({
  name: 'RecordPaymentInput',
  description: 'Input for recording a payment',
  fields: {
    invoiceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    method: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reference: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});



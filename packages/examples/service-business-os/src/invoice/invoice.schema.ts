import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

/**
 * Invoice issued for a job.
 */
export const InvoiceModel = defineSchemaModel({
  name: 'Invoice',
  description: 'Invoice issued for a job',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    invoiceNumber: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dueDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    issuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    paidAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

/**
 * Input for issuing an invoice.
 */
export const IssueInvoiceInputModel = defineSchemaModel({
  name: 'IssueInvoiceInput',
  description: 'Input for issuing an invoice',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dueDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    lineItems: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

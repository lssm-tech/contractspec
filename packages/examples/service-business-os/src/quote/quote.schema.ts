import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Quote/proposal.
 */
export const QuoteModel = defineSchemaModel({
  name: 'Quote',
  description: 'Quote/proposal',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    validUntil: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a quote.
 */
export const CreateQuoteInputModel = defineSchemaModel({
  name: 'CreateQuoteInput',
  description: 'Input for creating a quote',
  fields: {
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    validUntil: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Input for accepting a quote.
 */
export const AcceptQuoteInputModel = defineSchemaModel({
  name: 'AcceptQuoteInput',
  description: 'Input for accepting a quote',
  fields: {
    quoteId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    acceptedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});





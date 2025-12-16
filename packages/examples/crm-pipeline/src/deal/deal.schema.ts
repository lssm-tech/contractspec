import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { DealStatusEnum, DealStatusFilterEnum } from './deal.enum';

/**
 * A deal in the CRM pipeline.
 */
export const DealModel = defineSchemaModel({
  name: 'Deal',
  description: 'A deal in the CRM pipeline',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    pipelineId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: DealStatusEnum, isOptional: false },
    contactId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    companyId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    expectedCloseDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a deal.
 */
export const CreateDealInputModel = defineSchemaModel({
  name: 'CreateDealInput',
  description: 'Input for creating a deal',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    pipelineId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    contactId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    companyId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    expectedCloseDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

/**
 * Input for moving a deal to another stage.
 */
export const MoveDealInputModel = defineSchemaModel({
  name: 'MoveDealInput',
  description: 'Input for moving a deal to another stage',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    position: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

/**
 * Payload for deal moved event.
 */
export const DealMovedPayloadModel = defineSchemaModel({
  name: 'DealMovedPayload',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fromStage: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toStage: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Input for marking a deal as won.
 */
export const WinDealInputModel = defineSchemaModel({
  name: 'WinDealInput',
  description: 'Input for marking a deal as won',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    wonSource: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Payload for deal won event.
 */
export const DealWonPayloadModel = defineSchemaModel({
  name: 'DealWonPayload',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

/**
 * Input for marking a deal as lost.
 */
export const LoseDealInputModel = defineSchemaModel({
  name: 'LoseDealInput',
  description: 'Input for marking a deal as lost',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    lostReason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Payload for deal lost event.
 */
export const DealLostPayloadModel = defineSchemaModel({
  name: 'DealLostPayload',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Input for listing deals.
 */
export const ListDealsInputModel = defineSchemaModel({
  name: 'ListDealsInput',
  description: 'Input for listing deals',
  fields: {
    pipelineId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    stageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: DealStatusFilterEnum, isOptional: true },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
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
 * Output for listing deals.
 */
export const ListDealsOutputModel = defineSchemaModel({
  name: 'ListDealsOutput',
  description: 'Output for listing deals',
  fields: {
    deals: { type: DealModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalValue: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

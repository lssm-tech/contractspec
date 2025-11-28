import { defineCommand, defineQuery, } from '@lssm/lib.contracts/spec';
import { defineSchemaModel, ScalarTypeEnum, defineEnum } from '@lssm/lib.schema';

const OWNERS = ['example.crm-pipeline'] as const;

// ============ Enums ============

const DealStatusSchemaEnum = defineEnum('DealStatus', ['OPEN', 'WON', 'LOST', 'STALE']);
export const DealStatusFilterEnum = defineEnum('DealStatusFilter', ['OPEN', 'WON', 'LOST', 'all']);

// ============ Schemas ============

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
    status: { type: DealStatusSchemaEnum, isOptional: false },
    contactId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    companyId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    expectedCloseDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

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

export const MoveDealInputModel = defineSchemaModel({
  name: 'MoveDealInput',
  description: 'Input for moving a deal to another stage',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    position: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const DealMovedPayloadModel = defineSchemaModel({
  name: 'DealMovedPayload',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fromStage: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toStage: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const WinDealInputModel = defineSchemaModel({
  name: 'WinDealInput',
  description: 'Input for marking a deal as won',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    wonSource: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const DealWonPayloadModel = defineSchemaModel({
  name: 'DealWonPayload',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

export const LoseDealInputModel = defineSchemaModel({
  name: 'LoseDealInput',
  description: 'Input for marking a deal as lost',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    lostReason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const DealLostPayloadModel = defineSchemaModel({
  name: 'DealLostPayload',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListDealsInputModel = defineSchemaModel({
  name: 'ListDealsInput',
  description: 'Input for listing deals',
  fields: {
    pipelineId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    stageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: DealStatusFilterEnum, isOptional: true },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 20 },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 0 },
  },
});

export const ListDealsOutputModel = defineSchemaModel({
  name: 'ListDealsOutput',
  description: 'Output for listing deals',
  fields: {
    deals: { type: DealModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalValue: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Create a new deal.
 */
export const CreateDealContract = defineCommand({
  meta: {
    name: 'crm.deal.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'create'],
    description: 'Create a new deal in the pipeline.',
    goal: 'Allow sales reps to create new opportunities.',
    context: 'Deal creation UI, quick add.',
  },
  io: {
    input: CreateDealInputModel,
    output: DealModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [{ name: 'deal.created', version: 1, when: 'Deal is created', payload: DealModel }],
    audit: ['deal.created'],
  },
});

/**
 * Move deal to a different stage.
 */
export const MoveDealContract = defineCommand({
  meta: {
    name: 'crm.deal.move',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'move', 'kanban'],
    description: 'Move a deal to a different stage.',
    goal: 'Allow drag-and-drop stage movement in Kanban.',
    context: 'Pipeline Kanban view.',
  },
  io: {
    input: MoveDealInputModel,
    output: DealModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [{ name: 'deal.moved', version: 1, when: 'Deal stage changed', payload: DealMovedPayloadModel }],
    audit: ['deal.moved'],
  },
});

/**
 * Mark deal as won.
 */
export const WinDealContract = defineCommand({
  meta: {
    name: 'crm.deal.win',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'won'],
    description: 'Mark a deal as won.',
    goal: 'Close a deal as successful.',
    context: 'Deal closing flow.',
  },
  io: {
    input: WinDealInputModel,
    output: DealModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [{ name: 'deal.won', version: 1, when: 'Deal is won', payload: DealWonPayloadModel }],
    audit: ['deal.won'],
  },
});

/**
 * Mark deal as lost.
 */
export const LoseDealContract = defineCommand({
  meta: {
    name: 'crm.deal.lose',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'lost'],
    description: 'Mark a deal as lost.',
    goal: 'Close a deal as unsuccessful.',
    context: 'Deal closing flow.',
  },
  io: {
    input: LoseDealInputModel,
    output: DealModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [{ name: 'deal.lost', version: 1, when: 'Deal is lost', payload: DealLostPayloadModel }],
    audit: ['deal.lost'],
  },
});

/**
 * List deals in pipeline.
 */
export const ListDealsContract = defineQuery({
  meta: {
    name: 'crm.deal.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'list'],
    description: 'List deals with filters.',
    goal: 'Show pipeline, deal lists, dashboards.',
    context: 'Pipeline view, deal list.',
  },
  io: {
    input: ListDealsInputModel,
    output: ListDealsOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

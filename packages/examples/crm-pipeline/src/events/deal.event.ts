import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts';

// ============ Deal Event Payloads ============

const DealCreatedPayload = defineSchemaModel({
  name: 'DealCreatedPayload',
  description: 'Payload when a deal is created',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    pipelineId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const DealMovedPayload = defineSchemaModel({
  name: 'DealMovedEventPayload',
  description: 'Payload when a deal is moved to another stage',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fromStageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toStageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    movedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    movedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const DealWonPayload = defineSchemaModel({
  name: 'DealWonEventPayload',
  description: 'Payload when a deal is won',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    contactId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    companyId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    wonAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const DealLostPayload = defineSchemaModel({
  name: 'DealLostEventPayload',
  description: 'Payload when a deal is lost',
  fields: {
    dealId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    lostAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const DealCreatedEvent = defineEvent({
  meta: {
    key: 'deal.created',
    version: 1,
    description: 'A new deal has been created.',
    stability: 'stable',
    owners: ['@crm-team'],
    tags: ['deal', 'created'],
  },
  payload: DealCreatedPayload,
});

export const DealMovedEvent = defineEvent({
  meta: {
    key: 'deal.moved',
    version: 1,
    description: 'A deal has been moved to a different stage.',
    stability: 'stable',
    owners: ['@crm-team'],
    tags: ['deal', 'moved'],
  },
  payload: DealMovedPayload,
});

export const DealWonEvent = defineEvent({
  meta: {
    key: 'deal.won',
    version: 1,
    description: 'A deal has been won.',
    stability: 'stable',
    owners: ['@crm-team'],
    tags: ['deal', 'won'],
  },
  payload: DealWonPayload,
});

export const DealLostEvent = defineEvent({
  meta: {
    key: 'deal.lost',
    version: 1,
    description: 'A deal has been lost.',
    stability: 'stable',
    owners: ['@crm-team'],
    tags: ['deal', 'lost'],
  },
  payload: DealLostPayload,
});

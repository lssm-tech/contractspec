import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

// ============ Contact Event Payloads ============

const ContactCreatedPayload = defineSchemaModel({
  name: 'ContactCreatedPayload',
  description: 'Payload when a contact is created',
  fields: {
    contactId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: true },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

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

// ============ Task Event Payloads ============

const TaskCompletedPayload = defineSchemaModel({
  name: 'TaskCompletedPayload',
  description: 'Payload when a task is completed',
  fields: {
    taskId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    assignedTo: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    completedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Events ============

export const ContactCreatedEvent = defineEvent({
  name: 'contact.created',
  version: 1,
  description: 'A new contact has been created.',
  payload: ContactCreatedPayload,
});

export const DealCreatedEvent = defineEvent({
  name: 'deal.created',
  version: 1,
  description: 'A new deal has been created.',
  payload: DealCreatedPayload,
});

export const DealMovedEvent = defineEvent({
  name: 'deal.moved',
  version: 1,
  description: 'A deal has been moved to a different stage.',
  payload: DealMovedPayload,
});

export const DealWonEvent = defineEvent({
  name: 'deal.won',
  version: 1,
  description: 'A deal has been won.',
  payload: DealWonPayload,
});

export const DealLostEvent = defineEvent({
  name: 'deal.lost',
  version: 1,
  description: 'A deal has been lost.',
  payload: DealLostPayload,
});

export const TaskCompletedEvent = defineEvent({
  name: 'task.completed',
  version: 1,
  description: 'A task has been completed.',
  payload: TaskCompletedPayload,
});

// ============ All Events ============

export const CrmPipelineEvents = {
  ContactCreatedEvent,
  DealCreatedEvent,
  DealMovedEvent,
  DealWonEvent,
  DealLostEvent,
  TaskCompletedEvent,
};

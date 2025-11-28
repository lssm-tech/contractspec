import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

// ============ Project Event Payloads ============

const ProjectCreatedPayload = defineSchemaModel({
  name: 'ProjectCreatedPayload',
  description: 'Payload when a project is created',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ProjectUpdatedPayload = defineSchemaModel({
  name: 'ProjectUpdatedPayload',
  description: 'Payload when a project is updated',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedFields: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: false },
    updatedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ProjectDeletedPayload = defineSchemaModel({
  name: 'ProjectDeletedPayload',
  description: 'Payload when a project is deleted',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deletedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deletedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ProjectArchivedPayload = defineSchemaModel({
  name: 'ProjectArchivedPayload',
  description: 'Payload when a project is archived',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    archivedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    archivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Billing Event Payloads ============

const UsageRecordedPayload = defineSchemaModel({
  name: 'UsageRecordedPayload',
  description: 'Payload when feature usage is recorded',
  fields: {
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    billingPeriod: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recordedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UsageLimitReachedPayload = defineSchemaModel({
  name: 'UsageLimitReachedPayload',
  description: 'Payload when usage limit is reached',
  fields: {
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    currentUsage: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    reachedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const SubscriptionChangedPayload = defineSchemaModel({
  name: 'SubscriptionChangedPayload',
  description: 'Payload when subscription status changes',
  fields: {
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousPlan: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    newPlan: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Project Events ============

export const ProjectCreatedEvent = defineEvent({
  name: 'project.created',
  version: 1,
  description: 'A new project has been created.',
  payload: ProjectCreatedPayload,
});

export const ProjectUpdatedEvent = defineEvent({
  name: 'project.updated',
  version: 1,
  description: 'A project has been updated.',
  payload: ProjectUpdatedPayload,
});

export const ProjectDeletedEvent = defineEvent({
  name: 'project.deleted',
  version: 1,
  description: 'A project has been deleted.',
  payload: ProjectDeletedPayload,
});

export const ProjectArchivedEvent = defineEvent({
  name: 'project.archived',
  version: 1,
  description: 'A project has been archived.',
  payload: ProjectArchivedPayload,
});

// ============ Billing Events ============

export const UsageRecordedEvent = defineEvent({
  name: 'billing.usage.recorded',
  version: 1,
  description: 'Feature usage has been recorded.',
  payload: UsageRecordedPayload,
});

export const UsageLimitReachedEvent = defineEvent({
  name: 'billing.limit.reached',
  version: 1,
  description: 'Usage limit has been reached for a feature.',
  payload: UsageLimitReachedPayload,
});

export const SubscriptionChangedEvent = defineEvent({
  name: 'billing.subscription.changed',
  version: 1,
  description: 'Subscription status has changed.',
  payload: SubscriptionChangedPayload,
});

// ============ All Events ============

export const SaasBoilerplateEvents = {
  ProjectCreatedEvent,
  ProjectUpdatedEvent,
  ProjectDeletedEvent,
  ProjectArchivedEvent,
  UsageRecordedEvent,
  UsageLimitReachedEvent,
  SubscriptionChangedEvent,
};

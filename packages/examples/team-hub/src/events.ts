import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

const SpaceEventPayload = defineSchemaModel({
  name: 'SpaceEventPayload',
  description: 'Payload for space events',
  fields: {
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const TaskEventPayload = defineSchemaModel({
  name: 'TaskEventPayload',
  description: 'Payload for task events',
  fields: {
    taskId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    assigneeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const RitualEventPayload = defineSchemaModel({
  name: 'RitualEventPayload',
  description: 'Payload for ritual events',
  fields: {
    ritualId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledFor: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const AnnouncementPayload = defineSchemaModel({
  name: 'AnnouncementPayload',
  description: 'Payload for announcements',
  fields: {
    announcementId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    audience: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const SpaceCreatedEvent = defineEvent({
  name: 'team.space.created',
  version: 1,
  description: 'A space was created.',
  payload: SpaceEventPayload,
});

export const TaskCreatedEvent = defineEvent({
  name: 'team.task.created',
  version: 1,
  description: 'A task was created.',
  payload: TaskEventPayload,
});

export const TaskStatusChangedEvent = defineEvent({
  name: 'team.task.status_changed',
  version: 1,
  description: 'A task status changed.',
  payload: TaskEventPayload,
});

export const RitualScheduledEvent = defineEvent({
  name: 'team.ritual.scheduled',
  version: 1,
  description: 'A ritual was scheduled.',
  payload: RitualEventPayload,
});

export const RitualOccurredEvent = defineEvent({
  name: 'team.ritual.occurred',
  version: 1,
  description: 'A ritual occurrence was logged.',
  payload: RitualEventPayload,
});

export const AnnouncementPostedEvent = defineEvent({
  name: 'team.announcement.posted',
  version: 1,
  description: 'An announcement was posted.',
  payload: AnnouncementPayload,
});

export const TeamHubEvents = {
  SpaceCreatedEvent,
  TaskCreatedEvent,
  TaskStatusChangedEvent,
  RitualScheduledEvent,
  RitualOccurredEvent,
  AnnouncementPostedEvent,
};

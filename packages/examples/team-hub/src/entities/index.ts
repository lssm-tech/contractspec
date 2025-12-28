import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';
import type { ModuleSchemaContribution } from '@contractspec/lib.schema';

const schema = 'lssm_team_hub';

export const TaskStatusEnum = defineEntityEnum({
  name: 'TaskStatus',
  schema,
  values: ['BACKLOG', 'IN_PROGRESS', 'BLOCKED', 'DONE'] as const,
  description: 'Task workflow status.',
});

export const TaskPriorityEnum = defineEntityEnum({
  name: 'TaskPriority',
  schema,
  values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const,
  description: 'Task priority levels.',
});

export const RitualCadenceEnum = defineEntityEnum({
  name: 'RitualCadence',
  schema,
  values: ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'] as const,
  description: 'Recurrence cadence for rituals.',
});

export const AnnouncementAudienceEnum = defineEntityEnum({
  name: 'AnnouncementAudience',
  schema,
  values: ['ALL', 'SPACE', 'ROLE'] as const,
  description: 'Targeting scope for announcements.',
});

export const SpaceEntity = defineEntity({
  name: 'Space',
  description: 'Space/project container for a team.',
  schema,
  map: 'space',
  fields: {
    id: field.id({ description: 'Unique space identifier' }),
    name: field.string({ description: 'Space name' }),
    description: field.string({
      description: 'Space description',
      isOptional: true,
    }),
    orgId: field.string({ description: 'Organization ID' }),
    ownerId: field.string({ description: 'Space owner' }),
    members: field.json({ description: 'Member roles map', isOptional: true }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    tasks: field.hasMany('Task'),
    rituals: field.hasMany('Ritual'),
    announcements: field.hasMany('Announcement'),
  },
  indexes: [index.on(['orgId']), index.on(['ownerId']), index.on(['name'])],
});

export const TaskEntity = defineEntity({
  name: 'Task',
  description: 'Work item within a space.',
  schema,
  map: 'task',
  fields: {
    id: field.id({ description: 'Unique task identifier' }),
    spaceId: field.foreignKey({ description: 'Parent space' }),
    title: field.string({ description: 'Task title' }),
    description: field.string({
      description: 'Task details',
      isOptional: true,
    }),
    status: field.enum('TaskStatus', {
      description: 'Task status',
      default: 'BACKLOG',
    }),
    priority: field.enum('TaskPriority', {
      description: 'Task priority',
      default: 'MEDIUM',
    }),
    assigneeId: field.string({
      description: 'User assigned',
      isOptional: true,
    }),
    dueDate: field.dateTime({ description: 'Due date', isOptional: true }),
    tags: field.json({ description: 'Labels/tags', isOptional: true }),
    orgId: field.string({ description: 'Organization ID' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    space: field.belongsTo('Space', ['spaceId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  enums: [TaskStatusEnum, TaskPriorityEnum],
  indexes: [
    index.on(['spaceId']),
    index.on(['orgId', 'status']),
    index.on(['assigneeId', 'status']),
    index.on(['dueDate']),
  ],
});

export const RitualEntity = defineEntity({
  name: 'Ritual',
  description: 'Recurring ceremony (standup, retro, planning).',
  schema,
  map: 'ritual',
  fields: {
    id: field.id({ description: 'Unique ritual identifier' }),
    spaceId: field.foreignKey({ description: 'Parent space' }),
    title: field.string({ description: 'Ritual title' }),
    cadence: field.enum('RitualCadence', { description: 'Ritual cadence' }),
    dayOfWeek: field.string({ description: 'Day of week', isOptional: true }),
    time: field.string({ description: 'Local time (HH:mm)', isOptional: true }),
    facilitatorId: field.string({
      description: 'Facilitator user ID',
      isOptional: true,
    }),
    participants: field.json({
      description: 'Participant user IDs',
      isOptional: true,
    }),
    location: field.string({ description: 'Location/URL', isOptional: true }),
    agendaTemplate: field.string({
      description: 'Agenda template markdown',
      isOptional: true,
    }),
    orgId: field.string({ description: 'Organization ID' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    occurrences: field.hasMany('RitualOccurrence'),
    space: field.belongsTo('Space', ['spaceId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  enums: [RitualCadenceEnum],
  indexes: [index.on(['spaceId']), index.on(['orgId'])],
});

export const RitualOccurrenceEntity = defineEntity({
  name: 'RitualOccurrence',
  description: 'Specific occurrence of a ritual.',
  schema,
  map: 'ritual_occurrence',
  fields: {
    id: field.id({ description: 'Unique occurrence identifier' }),
    ritualId: field.foreignKey({ description: 'Parent ritual' }),
    scheduledFor: field.dateTime({ description: 'Scheduled datetime' }),
    status: field.string({
      description: 'Occurrence status',
      default: '"scheduled"',
    }),
    summary: field.string({ description: 'Summary/notes', isOptional: true }),
    attendance: field.json({
      description: 'Attendance list with responses',
      isOptional: true,
    }),
    recordingUrl: field.string({
      description: 'Recording link',
      isOptional: true,
    }),
    orgId: field.string({ description: 'Organization ID' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    ritual: field.belongsTo('Ritual', ['ritualId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.on(['ritualId']),
    index.on(['scheduledFor']),
    index.on(['orgId']),
  ],
});

export const AnnouncementEntity = defineEntity({
  name: 'Announcement',
  description: 'Announcement to a space or org.',
  schema,
  map: 'announcement',
  fields: {
    id: field.id({ description: 'Unique announcement identifier' }),
    spaceId: field.string({ description: 'Target space', isOptional: true }),
    title: field.string({ description: 'Announcement title' }),
    body: field.string({ description: 'Announcement body' }),
    audience: field.enum('AnnouncementAudience', {
      description: 'Audience targeting',
      default: 'ALL',
    }),
    audienceRole: field.string({
      description: 'Role targeted when audience is ROLE',
      isOptional: true,
    }),
    pinnedUntil: field.dateTime({
      description: 'Pin expiration',
      isOptional: true,
    }),
    orgId: field.string({ description: 'Organization ID' }),
    createdBy: field.string({ description: 'Creator user ID' }),
    createdAt: field.createdAt(),
    expiresAt: field.dateTime({
      description: 'Expiration time',
      isOptional: true,
    }),
  },
  enums: [AnnouncementAudienceEnum],
  indexes: [index.on(['orgId']), index.on(['spaceId']), index.on(['audience'])],
});

export const teamHubEntities = [
  SpaceEntity,
  TaskEntity,
  RitualEntity,
  RitualOccurrenceEntity,
  AnnouncementEntity,
];

export const teamHubSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@contractspec/example.team-hub',
  // schema,
  entities: teamHubEntities,
  enums: [
    TaskStatusEnum,
    TaskPriorityEnum,
    RitualCadenceEnum,
    AnnouncementAudienceEnum,
  ],
};

import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';

const OWNERS = ['examples.team-hub'] as const;

export const SpaceModel = defineSchemaModel({
  name: 'Space',
  description: 'Team space/project',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const TaskModel = defineSchemaModel({
  name: 'Task',
  description: 'Task in a space',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    priority: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    assigneeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    dueDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const RitualModel = defineSchemaModel({
  name: 'Ritual',
  description: 'Recurring ritual',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    cadence: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dayOfWeek: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    time: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const AnnouncementModel = defineSchemaModel({
  name: 'Announcement',
  description: 'Announcement to spaces/org',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    body: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    audience: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    audienceRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

// Inputs
const CreateSpaceInput = defineSchemaModel({
  name: 'CreateSpaceInput',
  description: 'Input for creating a space',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const CreateTaskInput = defineSchemaModel({
  name: 'CreateTaskInput',
  description: 'Input for creating a task',
  fields: {
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    priority: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    assigneeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    dueDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const UpdateTaskStatusInput = defineSchemaModel({
  name: 'UpdateTaskStatusInput',
  description: 'Update task status',
  fields: {
    taskId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const ScheduleRitualInput = defineSchemaModel({
  name: 'ScheduleRitualInput',
  description: 'Create a ritual',
  fields: {
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    cadence: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dayOfWeek: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    time: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    facilitatorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const LogRitualOccurrenceInput = defineSchemaModel({
  name: 'LogRitualOccurrenceInput',
  description: 'Record ritual occurrence results',
  fields: {
    ritualId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledFor: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const PostAnnouncementInput = defineSchemaModel({
  name: 'PostAnnouncementInput',
  description: 'Post an announcement',
  fields: {
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    body: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    audience: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    audienceRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

// Contracts
export const CreateSpaceContract = defineCommand({
  meta: {
    name: 'team.space.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'space', 'create'],
    description: 'Create a new team space.',
    goal: 'Organize teams/projects.',
    context: 'Workspace creation.',
  },
  io: {
    input: CreateSpaceInput,
    output: SpaceModel,
  },
  policy: { auth: 'user' },
});

export const CreateTaskContract = defineCommand({
  meta: {
    name: 'team.task.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'task', 'create'],
    description: 'Create a task inside a space.',
    goal: 'Track work items.',
    context: 'Task creation.',
  },
  io: {
    input: CreateTaskInput,
    output: TaskModel,
  },
  policy: { auth: 'user' },
});

export const UpdateTaskStatusContract = defineCommand({
  meta: {
    name: 'team.task.updateStatus',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'task', 'status'],
    description: 'Update a task status.',
    goal: 'Move tasks across board.',
    context: 'Kanban updates.',
  },
  io: {
    input: UpdateTaskStatusInput,
    output: TaskModel,
  },
  policy: { auth: 'user' },
});

export const ScheduleRitualContract = defineCommand({
  meta: {
    name: 'team.ritual.schedule',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'ritual', 'schedule'],
    description: 'Create/schedule a recurring ritual.',
    goal: 'Establish ceremonies.',
    context: 'Team ops.',
  },
  io: {
    input: ScheduleRitualInput,
    output: RitualModel,
  },
  policy: { auth: 'user' },
});

export const LogRitualOccurrenceContract = defineCommand({
  meta: {
    name: 'team.ritual.logOccurrence',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'ritual', 'log'],
    description: 'Record a ritual occurrence.',
    goal: 'Track participation and outcomes.',
    context: 'After meeting.',
  },
  io: {
    input: LogRitualOccurrenceInput,
    output: defineSchemaModel({
      name: 'RitualOccurrenceResult',
      description: 'Logged occurrence',
      fields: {
        ritualId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        scheduledFor: { type: ScalarTypeEnum.DateTime(), isOptional: false },
        status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
      },
    }),
  },
  policy: { auth: 'user' },
});

export const PostAnnouncementContract = defineCommand({
  meta: {
    name: 'team.announcement.post',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'announcement', 'post'],
    description: 'Post an announcement to spaces or org.',
    goal: 'Share updates broadly.',
    context: 'Internal comms.',
  },
  io: {
    input: PostAnnouncementInput,
    output: AnnouncementModel,
  },
  policy: { auth: 'user' },
});

export const ListTasksContract = defineQuery({
  meta: {
    name: 'team.task.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'task', 'list'],
    description: 'List tasks in a space with filters.',
    goal: 'Populate kanban/agenda.',
    context: 'Dashboard.',
  },
  io: {
    input: defineSchemaModel({
      name: 'ListTasksInput',
      description: 'Task filters',
      fields: {
        spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        assigneeId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: true,
        },
      },
    }),
    output: defineSchemaModel({
      name: 'ListTasksOutput',
      description: 'Tasks response',
      fields: {
        tasks: { type: TaskModel, isArray: true, isOptional: false },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
      },
    }),
  },
  policy: { auth: 'user' },
});

import { defineCommand, defineQuery } from '@lssm/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import {
  TaskModel,
  CreateTaskInputModel,
  UpdateTaskStatusInputModel,
} from './task.schema';

const OWNERS = ['@examples.team-hub'] as const;

// ============ List Tasks Query ============

export const ListTasksInputModel = defineSchemaModel({
  name: 'ListTasksInput',
  description: 'Input for listing tasks',
  fields: {
    spaceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    assigneeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const ListTasksOutputModel = defineSchemaModel({
  name: 'ListTasksOutput',
  description: 'Output for listing tasks',
  fields: {
    tasks: { type: TaskModel, isOptional: false, isList: true },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const ListTasksOperation = defineQuery({
  meta: {
    name: 'team.task.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'task', 'list', 'query'],
    description: 'List all tasks with filtering',
    goal: 'Retrieve list of tasks',
    context: 'Task management',
  },
  io: {
    input: ListTasksInputModel,
    output: ListTasksOutputModel,
  },
  policy: { auth: 'user' },
});

// ============ Task Commands ============

/**
 * Create a task.
 */
export const CreateTaskContract = defineCommand({
  meta: {
    name: 'team.task.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'task', 'create'],
    description: 'Create a task.',
    goal: 'Track work.',
    context: 'Task management.',
  },
  io: {
    input: CreateTaskInputModel,
    output: TaskModel,
  },
  policy: { auth: 'user' },
});

/**
 * Update task status.
 */
export const UpdateTaskStatusContract = defineCommand({
  meta: {
    name: 'team.task.updateStatus',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'task', 'status'],
    description: 'Update task status.',
    goal: 'Track progress.',
    context: 'Task management.',
  },
  io: {
    input: UpdateTaskStatusInputModel,
    output: TaskModel,
  },
  policy: { auth: 'user' },
});

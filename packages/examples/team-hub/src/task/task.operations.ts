import { defineCommand, defineQuery } from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import {
  CreateTaskInputModel,
  TaskModel,
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
    key: 'team.task.list',
    version: '1.0.0',
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
  acceptance: {
    scenarios: [
      {
        key: 'list-tasks-happy-path',
        given: ['Tasks exist'],
        when: ['User lists tasks'],
        then: ['List of tasks is returned'],
      },
    ],
    examples: [
      {
        key: 'list-my-tasks',
        input: { assigneeId: 'user-123', status: 'open', limit: 10 },
        output: { tasks: [], total: 3 },
      },
    ],
  },
});

// ============ Task Commands ============

/**
 * Create a task.
 */
export const CreateTaskContract = defineCommand({
  meta: {
    key: 'team.task.create',
    version: '1.0.0',
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
  acceptance: {
    scenarios: [
      {
        key: 'create-task-happy-path',
        given: ['Space exists'],
        when: ['User creates task'],
        then: ['Task is created'],
      },
    ],
    examples: [
      {
        key: 'create-bug',
        input: { spaceId: 'space-123', title: 'Fix login bug', type: 'bug' },
        output: { id: 'task-456', status: 'todo' },
      },
    ],
  },
});

/**
 * Update task status.
 */
export const UpdateTaskStatusContract = defineCommand({
  meta: {
    key: 'team.task.updateStatus',
    version: '1.0.0',
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
  acceptance: {
    scenarios: [
      {
        key: 'update-status-happy-path',
        given: ['Task exists'],
        when: ['User updates status'],
        then: ['Status is updated'],
      },
    ],
    examples: [
      {
        key: 'markup-done',
        input: { taskId: 'task-456', status: 'done' },
        output: { id: 'task-456', status: 'done' },
      },
    ],
  },
});

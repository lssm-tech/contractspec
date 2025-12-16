import { defineCommand } from '@lssm/lib.contracts';
import { TaskModel, CreateTaskInputModel, UpdateTaskStatusInputModel } from './task.schema';

const OWNERS = ['@examples.team-hub'] as const;

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



import { defineQuery } from '@lssm/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { TaskModel } from './task.schema';

const OWNERS = ['@examples.team-hub'] as const;

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

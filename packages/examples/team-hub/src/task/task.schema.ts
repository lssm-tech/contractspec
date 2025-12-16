import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Task in a space.
 */
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

/**
 * Input for creating a task.
 */
export const CreateTaskInputModel = defineSchemaModel({
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

/**
 * Input for updating task status.
 */
export const UpdateTaskStatusInputModel = defineSchemaModel({
  name: 'UpdateTaskStatusInput',
  description: 'Update task status',
  fields: {
    taskId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

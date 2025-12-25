import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

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

export const TaskCompletedEvent = defineEvent({
  meta: {
    key: 'task.completed',
    version: 1,
    description: 'A task has been completed.',
    stability: 'stable',
    owners: ['@crm-team'],
    tags: ['task', 'lifecycle'],
  },
  payload: TaskCompletedPayload,
});

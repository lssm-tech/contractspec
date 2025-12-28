import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Task type enum.
 */
export const TaskTypeEnum = defineEntityEnum({
  name: 'TaskType',
  values: ['CALL', 'EMAIL', 'MEETING', 'TODO', 'FOLLOW_UP', 'OTHER'] as const,
  schema: 'crm',
  description: 'Type of CRM task.',
});

/**
 * Task priority enum.
 */
export const TaskPriorityEnum = defineEntityEnum({
  name: 'TaskPriority',
  values: ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const,
  schema: 'crm',
  description: 'Priority of a task.',
});

/**
 * Task status enum.
 */
export const TaskStatusEnum = defineEntityEnum({
  name: 'TaskStatus',
  values: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const,
  schema: 'crm',
  description: 'Status of a task.',
});

/**
 * Task entity - follow-up activities.
 */
export const TaskEntity = defineEntity({
  name: 'Task',
  description: 'A task or follow-up activity.',
  schema: 'crm',
  map: 'task',
  fields: {
    id: field.id(),
    title: field.string({ description: 'Task title' }),
    description: field.string({ isOptional: true }),

    // Type and priority
    type: field.enum('TaskType', { default: 'TODO' }),
    priority: field.enum('TaskPriority', { default: 'NORMAL' }),
    status: field.enum('TaskStatus', { default: 'PENDING' }),

    // Schedule
    dueDate: field.dateTime({ isOptional: true }),
    reminderAt: field.dateTime({ isOptional: true }),

    // Associations (polymorphic)
    contactId: field.string({ isOptional: true }),
    dealId: field.string({ isOptional: true }),
    companyId: field.string({ isOptional: true }),

    // Ownership
    organizationId: field.foreignKey(),
    assignedTo: field.foreignKey({ description: 'User assigned to this task' }),
    createdBy: field.foreignKey(),

    // Completion
    completedAt: field.dateTime({ isOptional: true }),
    completedBy: field.string({ isOptional: true }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    contact: field.belongsTo('Contact', ['contactId'], ['id']),
    deal: field.belongsTo('Deal', ['dealId'], ['id']),
    company: field.belongsTo('Company', ['companyId'], ['id']),
  },
  indexes: [
    index.on(['organizationId', 'assignedTo', 'status']),
    index.on(['dueDate', 'status']),
    index.on(['contactId']),
    index.on(['dealId']),
  ],
  enums: [TaskTypeEnum, TaskPriorityEnum, TaskStatusEnum],
});

/**
 * Activity entity - interaction history.
 */
export const ActivityEntity = defineEntity({
  name: 'Activity',
  description: 'An activity/interaction logged in the CRM.',
  schema: 'crm',
  map: 'activity',
  fields: {
    id: field.id(),
    type: field.enum('TaskType'),
    subject: field.string(),
    description: field.string({ isOptional: true }),

    // Associations
    contactId: field.string({ isOptional: true }),
    dealId: field.string({ isOptional: true }),
    companyId: field.string({ isOptional: true }),

    // Ownership
    organizationId: field.foreignKey(),
    performedBy: field.foreignKey(),

    // Outcome
    outcome: field.string({ isOptional: true }),

    // Timing
    occurredAt: field.dateTime(),
    duration: field.int({
      isOptional: true,
      description: 'Duration in minutes',
    }),

    // Timestamps
    createdAt: field.createdAt(),

    // Relations
    contact: field.belongsTo('Contact', ['contactId'], ['id']),
    deal: field.belongsTo('Deal', ['dealId'], ['id']),
    company: field.belongsTo('Company', ['companyId'], ['id']),
  },
  indexes: [
    index.on(['contactId', 'occurredAt']),
    index.on(['dealId', 'occurredAt']),
  ],
});

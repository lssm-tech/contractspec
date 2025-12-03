import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Instance status enum - lifecycle of a workflow instance.
 */
export const InstanceStatusEnum = defineEntityEnum({
  name: 'InstanceStatus',
  values: [
    'PENDING', // Created but not started
    'RUNNING', // Currently executing
    'WAITING', // Waiting for approval/event
    'PAUSED', // Manually paused
    'COMPLETED', // Successfully completed
    'CANCELLED', // Cancelled by user
    'FAILED', // Failed due to error
    'TIMEOUT', // Timed out
  ] as const,
  schema: 'workflow',
  description: 'Status of a workflow instance.',
});

/**
 * Step execution status enum.
 */
export const StepExecutionStatusEnum = defineEntityEnum({
  name: 'StepExecutionStatus',
  values: [
    'PENDING', // Not yet started
    'ACTIVE', // Currently active
    'COMPLETED', // Successfully completed
    'SKIPPED', // Skipped due to condition
    'FAILED', // Failed
    'TIMEOUT', // Timed out
  ] as const,
  schema: 'workflow',
  description: 'Status of a step execution.',
});

/**
 * WorkflowInstance entity - a running instance of a workflow.
 *
 * When a workflow is triggered, an instance is created. The instance
 * tracks the current state and all data associated with this execution.
 */
export const WorkflowInstanceEntity = defineEntity({
  name: 'WorkflowInstance',
  description: 'A running instance of a workflow definition.',
  schema: 'workflow',
  map: 'workflow_instance',
  fields: {
    id: field.id({ description: 'Unique instance ID' }),

    // Parent workflow
    workflowDefinitionId: field.foreignKey(),

    // Reference
    referenceId: field.string({
      isOptional: true,
      description: 'External reference (e.g., order ID)',
    }),
    referenceType: field.string({
      isOptional: true,
      description: 'Type of reference (e.g., "Order")',
    }),

    // Current state
    status: field.enum('InstanceStatus', { default: 'PENDING' }),
    currentStepId: field.string({
      isOptional: true,
      description: 'Current step being executed',
    }),

    // Context data - passed through the workflow
    contextData: field.json({ description: 'Data context for this instance' }),

    // Trigger info
    triggeredBy: field.foreignKey({
      description: 'User who triggered the workflow',
    }),
    triggerSource: field.string({
      isOptional: true,
      description: 'Source of trigger (e.g., "api", "ui")',
    }),

    // Ownership
    organizationId: field.foreignKey(),

    // Priority
    priority: field.int({
      default: 0,
      description: 'Processing priority (higher = more urgent)',
    }),

    // Deadlines
    dueAt: field.dateTime({
      isOptional: true,
      description: 'When this instance should complete',
    }),

    // Results
    outcome: field.string({
      isOptional: true,
      description: 'Final outcome (e.g., "approved", "rejected")',
    }),
    resultData: field.json({
      isOptional: true,
      description: 'Final result data',
    }),
    errorMessage: field.string({
      isOptional: true,
      description: 'Error message if failed',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    startedAt: field.dateTime({ isOptional: true }),
    completedAt: field.dateTime({ isOptional: true }),

    // Relations
    workflowDefinition: field.belongsTo(
      'WorkflowDefinition',
      ['workflowDefinitionId'],
      ['id']
    ),
    currentStep: field.belongsTo('WorkflowStep', ['currentStepId'], ['id']),
    stepExecutions: field.hasMany('StepExecution'),
    approvalRequests: field.hasMany('ApprovalRequest'),
  },
  indexes: [
    index.on(['organizationId', 'status']),
    index.on(['workflowDefinitionId', 'status']),
    index.on(['referenceType', 'referenceId']),
    index.on(['triggeredBy', 'status']),
    index.on(['status', 'dueAt']),
    index.on(['createdAt']),
  ],
  enums: [InstanceStatusEnum],
});

/**
 * StepExecution entity - tracks execution of a step within an instance.
 */
export const StepExecutionEntity = defineEntity({
  name: 'StepExecution',
  description: 'Execution record of a step within a workflow instance.',
  schema: 'workflow',
  map: 'step_execution',
  fields: {
    id: field.id({ description: 'Unique execution ID' }),

    // Parent
    workflowInstanceId: field.foreignKey(),
    workflowStepId: field.foreignKey(),

    // Status
    status: field.enum('StepExecutionStatus', { default: 'PENDING' }),

    // Execution order
    executionOrder: field.int({
      default: 0,
      description: 'Order of execution within instance',
    }),

    // Input/Output
    inputData: field.json({
      isOptional: true,
      description: 'Data when entering step',
    }),
    outputData: field.json({
      isOptional: true,
      description: 'Data when exiting step',
    }),

    // Action taken
    actionTaken: field.string({
      isOptional: true,
      description: 'Action that caused transition (e.g., "approve")',
    }),
    transitionedTo: field.string({
      isOptional: true,
      description: 'Step key transitioned to',
    }),

    // Executor
    executedBy: field.string({
      isOptional: true,
      description: 'User who completed this step',
    }),

    // Error
    errorMessage: field.string({ isOptional: true }),
    errorDetails: field.json({ isOptional: true }),

    // Retries
    retryCount: field.int({ default: 0 }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    startedAt: field.dateTime({ isOptional: true }),
    completedAt: field.dateTime({ isOptional: true }),

    // Relations
    workflowInstance: field.belongsTo(
      'WorkflowInstance',
      ['workflowInstanceId'],
      ['id'],
      { onDelete: 'Cascade' }
    ),
    workflowStep: field.belongsTo('WorkflowStep', ['workflowStepId'], ['id']),
  },
  indexes: [
    index.on(['workflowInstanceId', 'executionOrder']),
    index.on(['workflowInstanceId', 'workflowStepId']),
    index.on(['status']),
  ],
  enums: [StepExecutionStatusEnum],
});



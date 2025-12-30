import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Step type enum - what kind of step this is.
 */
export const StepTypeEnum = defineEntityEnum({
  name: 'StepType',
  values: [
    'START', // Entry point
    'APPROVAL', // Requires human approval
    'TASK', // Task to be completed
    'CONDITION', // Branching based on conditions
    'PARALLEL', // Parallel execution
    'WAIT', // Wait for event/time
    'ACTION', // Automated action
    'END', // Terminal state
  ] as const,
  schema: 'workflow',
  description: 'Type of workflow step.',
});

/**
 * Approval mode enum - how approvals are handled.
 */
export const ApprovalModeEnum = defineEntityEnum({
  name: 'ApprovalMode',
  values: [
    'ANY', // Any one approver can approve
    'ALL', // All approvers must approve
    'MAJORITY', // Majority must approve
    'SEQUENTIAL', // Approvers must approve in order
  ] as const,
  schema: 'workflow',
  description: 'How multiple approvers are handled.',
});

/**
 * WorkflowStep entity - defines a step in a workflow.
 *
 * Each step represents a state in the workflow state machine,
 * with transitions defined by the `transitions` JSON field.
 */
export const WorkflowStepEntity = defineEntity({
  name: 'WorkflowStep',
  description: 'A single step/state in a workflow definition.',
  schema: 'workflow',
  map: 'workflow_step',
  fields: {
    id: field.id({ description: 'Unique step ID' }),

    // Parent workflow
    workflowDefinitionId: field.foreignKey(),

    // Identity
    name: field.string({ description: 'Human-readable step name' }),
    key: field.string({
      description: 'Unique key within workflow (e.g., "manager_approval")',
    }),
    description: field.string({ isOptional: true }),

    // Type
    type: field.enum('StepType', { default: 'TASK' }),

    // Position in UI
    position: field.int({ default: 0, description: 'Order for display' }),

    // State machine transitions (JSON: { "approve": "next_step", "reject": "rejected" })
    transitions: field.json({ description: 'Map of action -> next step key' }),

    // Approval configuration (when type is APPROVAL)
    approvalMode: field.enum('ApprovalMode', {
      default: 'ANY',
      isOptional: true,
    }),
    approverRoles: field.string({
      isArray: true,
      description: 'Roles that can approve',
    }),
    approverUserIds: field.string({
      isArray: true,
      description: 'Specific users that can approve',
    }),
    escalationConfig: field.json({
      isOptional: true,
      description: 'Escalation rules',
    }),

    // Task configuration (when type is TASK)
    assigneeRoles: field.string({
      isArray: true,
      description: 'Roles that can be assigned',
    }),
    taskTemplate: field.json({
      isOptional: true,
      description: 'Template for task creation',
    }),

    // Condition configuration (when type is CONDITION)
    conditionExpression: field.string({
      isOptional: true,
      description: 'Expression for branching',
    }),

    // Wait configuration (when type is WAIT)
    waitDuration: field.int({
      isOptional: true,
      description: 'Wait duration in seconds',
    }),
    waitForEvent: field.string({
      isOptional: true,
      description: 'Event name to wait for',
    }),

    // Action configuration (when type is ACTION)
    actionType: field.string({
      isOptional: true,
      description: 'Action to execute',
    }),
    actionConfig: field.json({
      isOptional: true,
      description: 'Action parameters',
    }),

    // Timeout & SLA
    timeoutSeconds: field.int({
      isOptional: true,
      description: 'Step timeout',
    }),
    slaSeconds: field.int({ isOptional: true, description: 'SLA deadline' }),

    // Notifications
    notifyOnEnter: field.json({
      isOptional: true,
      description: 'Notification config when entering step',
    }),
    notifyOnExit: field.json({
      isOptional: true,
      description: 'Notification config when exiting step',
    }),

    // Metadata
    metadata: field.json({ isOptional: true }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    workflowDefinition: field.belongsTo(
      'WorkflowDefinition',
      ['workflowDefinitionId'],
      ['id'],
      { onDelete: 'Cascade' }
    ),
    executions: field.hasMany('StepExecution'),
  },
  indexes: [
    index.unique(['workflowDefinitionId', 'key']),
    index.on(['workflowDefinitionId', 'position']),
    index.on(['type']),
  ],
  enums: [StepTypeEnum, ApprovalModeEnum],
});

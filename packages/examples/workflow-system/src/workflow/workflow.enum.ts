import { defineEnum } from '@lssm/lib.schema';

/**
 * Workflow status enum.
 */
export const WorkflowStatusEnum = defineEnum('WorkflowStatus', [
  'DRAFT',
  'ACTIVE',
  'DEPRECATED',
  'ARCHIVED',
]);

/**
 * Trigger type enum.
 */
export const TriggerTypeEnum = defineEnum('WorkflowTriggerType', [
  'MANUAL',
  'EVENT',
  'SCHEDULED',
  'API',
]);

/**
 * Step type enum.
 */
export const StepTypeEnum = defineEnum('StepType', [
  'START',
  'APPROVAL',
  'TASK',
  'CONDITION',
  'PARALLEL',
  'WAIT',
  'ACTION',
  'END',
]);

/**
 * Approval mode enum.
 */
export const ApprovalModeEnum = defineEnum('ApprovalMode', [
  'ANY',
  'ALL',
  'MAJORITY',
  'SEQUENTIAL',
]);

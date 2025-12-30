/**
 * Mock data store for workflow system.
 * In production, this would be backed by a database.
 */

import type {
  WorkflowDefinitionRecord,
  WorkflowStepRecord,
  WorkflowInstanceRecord,
  ApprovalRequestRecord,
} from './types';

export const mockDataStore = {
  workflows: new Map<string, WorkflowDefinitionRecord>(),
  steps: new Map<string, WorkflowStepRecord>(),
  instances: new Map<string, WorkflowInstanceRecord>(),
  approvals: new Map<string, ApprovalRequestRecord>(),
  stepExecutions: new Map<
    string,
    { id: string; instanceId: string; stepId: string; status: string }
  >(),
};

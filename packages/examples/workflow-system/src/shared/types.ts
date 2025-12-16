/**
 * Shared types for workflow system handlers.
 */

export interface WorkflowDefinitionRecord {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: number;
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED';
  triggerType: 'MANUAL' | 'EVENT' | 'SCHEDULED' | 'API';
  initialStepId?: string;
  featureFlagKey?: string;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface WorkflowStepRecord {
  id: string;
  workflowDefinitionId: string;
  key: string;
  name: string;
  description?: string;
  type:
    | 'START'
    | 'APPROVAL'
    | 'TASK'
    | 'CONDITION'
    | 'PARALLEL'
    | 'WAIT'
    | 'ACTION'
    | 'END';
  position: number;
  transitions: Record<string, string>;
  approvalMode?: 'ANY' | 'ALL' | 'MAJORITY' | 'SEQUENTIAL';
  approverRoles: string[];
  timeoutSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowInstanceRecord {
  id: string;
  workflowDefinitionId: string;
  referenceId?: string;
  referenceType?: string;
  status:
    | 'PENDING'
    | 'RUNNING'
    | 'WAITING'
    | 'PAUSED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'FAILED'
    | 'TIMEOUT';
  currentStepId?: string;
  contextData: Record<string, unknown>;
  triggeredBy: string;
  organizationId: string;
  priority: number;
  dueAt?: Date;
  outcome?: string;
  resultData?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ApprovalRequestRecord {
  id: string;
  workflowInstanceId: string;
  stepExecutionId: string;
  approverId: string;
  approverRole?: string;
  title: string;
  description?: string;
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'DELEGATED'
    | 'ESCALATED'
    | 'WITHDRAWN'
    | 'EXPIRED';
  decision?: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'DELEGATE' | 'ABSTAIN';
  decisionComment?: string;
  decidedAt?: Date;
  dueAt?: Date;
  contextSnapshot?: Record<string, unknown>;
  sequenceOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HandlerContext {
  userId: string;
  userRoles: string[];
  organizationId: string;
}

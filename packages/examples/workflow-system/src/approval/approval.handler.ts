/**
 * Approval handlers.
 */

import type {
  ApprovalRequestRecord,
  WorkflowInstanceRecord,
  WorkflowStepRecord,
  HandlerContext,
} from '../shared/types';
import { mockDataStore } from '../shared/mock-data';
import { handleTransitionWorkflow } from '../instance/instance.handler';

export async function createApprovalRequests(
  instance: WorkflowInstanceRecord,
  step: WorkflowStepRecord,
  _context: HandlerContext
): Promise<void> {
  const now = new Date();

  // Create approval request for each approver role
  // In production, this would resolve roles to actual users
  for (let i = 0; i < step.approverRoles.length; i++) {
    const role = step.approverRoles[i];
    const id = `approval_${Date.now()}_${i}`;

    const request: ApprovalRequestRecord = {
      id,
      workflowInstanceId: instance.id,
      stepExecutionId: `exec_${instance.id}_${step.id}`,
      approverId: `user_${role}`, // In production, resolve to actual user
      approverRole: role,
      title: `Approval required for ${step.name}`,
      description: step.description,
      status: 'PENDING',
      contextSnapshot: instance.contextData,
      sequenceOrder: i,
      createdAt: now,
      updatedAt: now,
    };

    mockDataStore.approvals.set(id, request);
  }
}

export async function handleSubmitDecision(
  input: {
    requestId: string;
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'DELEGATE' | 'ABSTAIN';
    comment?: string;
    data?: Record<string, unknown>;
  },
  context: HandlerContext
): Promise<ApprovalRequestRecord> {
  const request = mockDataStore.approvals.get(input.requestId);
  if (!request) {
    throw new Error(`Approval request ${input.requestId} not found`);
  }

  // Verify approver
  if (
    request.approverId !== context.userId &&
    !context.userRoles.includes(request.approverRole ?? '')
  ) {
    throw new Error('User is not authorized to make this decision');
  }

  const now = new Date();
  request.decision = input.decision;
  request.decisionComment = input.comment;
  request.decidedAt = now;
  request.updatedAt = now;

  if (input.decision === 'APPROVE') {
    request.status = 'APPROVED';
    // Trigger workflow transition
    await handleTransitionWorkflow(
      {
        instanceId: request.workflowInstanceId,
        action: 'approve',
        data: input.data,
        comment: input.comment,
      },
      context
    );
  } else if (input.decision === 'REJECT') {
    request.status = 'REJECTED';
    await handleTransitionWorkflow(
      {
        instanceId: request.workflowInstanceId,
        action: 'reject',
        data: input.data,
        comment: input.comment,
      },
      context
    );
  }

  return request;
}

export async function handleListMyApprovals(
  input: {
    status?:
      | 'PENDING'
      | 'APPROVED'
      | 'REJECTED'
      | 'DELEGATED'
      | 'ESCALATED'
      | 'WITHDRAWN'
      | 'EXPIRED';
    limit?: number;
    offset?: number;
  },
  context: HandlerContext
): Promise<{
  requests: ApprovalRequestRecord[];
  total: number;
  pendingCount: number;
}> {
  let requests = Array.from(mockDataStore.approvals.values()).filter(
    (r) =>
      r.approverId === context.userId ||
      context.userRoles.includes(r.approverRole ?? '')
  );

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  if (input.status) {
    requests = requests.filter((r) => r.status === input.status);
  }

  const total = requests.length;
  const offset = input.offset ?? 0;
  const limit = input.limit ?? 20;

  requests = requests
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(offset, offset + limit);

  return { requests, total, pendingCount };
}

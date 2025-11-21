import { randomUUID } from 'node:crypto';
import type { AgentSessionState } from '../types';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: string;
  sessionId: string;
  agent: string;
  tenantId?: string;
  reason: string;
  requestedAt: Date;
  status: ApprovalStatus;
  payload?: Record<string, unknown>;
  reviewer?: string;
  resolvedAt?: Date;
  notes?: string;
}

export interface ApprovalStore {
  create(request: ApprovalRequest): Promise<void>;
  update(
    id: string,
    updates: Partial<Omit<ApprovalRequest, 'id' | 'sessionId'>>
  ): Promise<void>;
  list(status?: ApprovalStatus): Promise<ApprovalRequest[]>;
}

export class InMemoryApprovalStore implements ApprovalStore {
  private readonly items: ApprovalRequest[] = [];

  async create(request: ApprovalRequest): Promise<void> {
    this.items.push(request);
  }

  async update(
    id: string,
    updates: Partial<Omit<ApprovalRequest, 'id' | 'sessionId'>>
  ): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return;
    this.items[index] = { ...this.items[index], ...updates } as ApprovalRequest;
  }

  async list(status?: ApprovalStatus): Promise<ApprovalRequest[]> {
    return status
      ? this.items.filter((item) => item.status === status)
      : [...this.items];
  }
}

export interface ApprovalWorkflowOptions {
  store?: ApprovalStore;
}

export class ApprovalWorkflow {
  constructor(
    private readonly store: ApprovalStore = new InMemoryApprovalStore()
  ) {}

  async requestApproval(
    session: AgentSessionState,
    reason: string,
    payload?: Record<string, unknown>
  ) {
    const request: ApprovalRequest = {
      id: randomUUID(),
      sessionId: session.sessionId,
      agent: session.agent,
      tenantId: session.tenantId,
      reason,
      requestedAt: new Date(),
      status: 'pending',
      payload,
    };
    await this.store.create(request);
    return request;
  }

  async resolve(
    id: string,
    status: Exclude<ApprovalStatus, 'pending'>,
    reviewer: string,
    notes?: string
  ) {
    await this.store.update(id, {
      status,
      reviewer,
      resolvedAt: new Date(),
      notes,
    });
  }

  async listPending() {
    return this.store.list('pending');
  }
}

import { randomUUID } from 'node:crypto';
import type { ToolCallInfo } from '../types';
import { getDefaultI18n } from '../i18n';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

/**
 * Approval request for a tool execution.
 *
 * When a tool has `needsApproval: true` in AI SDK v6, the agent
 * will pause and wait for approval before executing the tool.
 */
export interface ApprovalRequest {
  /** Unique request ID */
  id: string;
  /** Agent session ID */
  sessionId: string;
  /** Agent ID */
  agentId: string;
  /** Tenant ID for scoping */
  tenantId?: string;
  /** Tool name requiring approval */
  toolName: string;
  /** Tool call ID from AI SDK */
  toolCallId: string;
  /** Tool arguments */
  toolArgs: unknown;
  /** Human-readable reason for approval */
  reason: string;
  /** When the approval was requested */
  requestedAt: Date;
  /** Current status */
  status: ApprovalStatus;
  /** Additional context payload */
  payload?: Record<string, unknown>;
  /** Who resolved the approval */
  reviewer?: string;
  /** When the approval was resolved */
  resolvedAt?: Date;
  /** Reviewer notes */
  notes?: string;
}

/**
 * Storage interface for approval requests.
 */
export interface ApprovalStore {
  create(request: ApprovalRequest): Promise<void>;
  get(id: string): Promise<ApprovalRequest | null>;
  getByToolCallId(toolCallId: string): Promise<ApprovalRequest | null>;
  update(
    id: string,
    updates: Partial<Omit<ApprovalRequest, 'id' | 'sessionId'>>
  ): Promise<void>;
  list(options?: {
    status?: ApprovalStatus;
    agentId?: string;
    tenantId?: string;
  }): Promise<ApprovalRequest[]>;
}

export interface InMemoryApprovalStoreOptions {
  maxItems?: number;
}

/**
 * In-memory approval store for development and testing.
 */
export class InMemoryApprovalStore implements ApprovalStore {
  private readonly items = new Map<string, ApprovalRequest>();
  private readonly maxItems: number;

  constructor(options: InMemoryApprovalStoreOptions = {}) {
    this.maxItems = options.maxItems ?? 1000;
  }

  async create(request: ApprovalRequest): Promise<void> {
    this.evictIfNeeded();
    this.items.set(request.id, request);
  }

  async get(id: string): Promise<ApprovalRequest | null> {
    return this.items.get(id) ?? null;
  }

  async getByToolCallId(toolCallId: string): Promise<ApprovalRequest | null> {
    for (const request of this.items.values()) {
      if (request.toolCallId === toolCallId) {
        return request;
      }
    }
    return null;
  }

  async update(
    id: string,
    updates: Partial<Omit<ApprovalRequest, 'id' | 'sessionId'>>
  ): Promise<void> {
    const existing = this.items.get(id);
    if (existing) {
      this.items.set(id, { ...existing, ...updates });
    }
  }

  async list(options?: {
    status?: ApprovalStatus;
    agentId?: string;
    tenantId?: string;
  }): Promise<ApprovalRequest[]> {
    let results = [...this.items.values()];

    if (options?.status) {
      results = results.filter((r) => r.status === options.status);
    }
    if (options?.agentId) {
      results = results.filter((r) => r.agentId === options.agentId);
    }
    if (options?.tenantId) {
      results = results.filter((r) => r.tenantId === options.tenantId);
    }

    return results.sort(
      (a, b) => b.requestedAt.getTime() - a.requestedAt.getTime()
    );
  }

  clear(): void {
    this.items.clear();
  }

  private evictIfNeeded(): void {
    if (this.items.size < this.maxItems) {
      return;
    }

    let oldestId: string | null = null;
    let oldestTimestamp = Number.POSITIVE_INFINITY;

    for (const [id, request] of this.items.entries()) {
      const ts = request.requestedAt.getTime();
      if (ts < oldestTimestamp) {
        oldestTimestamp = ts;
        oldestId = id;
      }
    }

    if (oldestId) {
      this.items.delete(oldestId);
    }
  }
}

/**
 * Approval workflow for managing tool execution approvals.
 *
 * Integrates with AI SDK v6's `needsApproval` feature on tools.
 *
 * @example
 * ```typescript
 * const workflow = new ApprovalWorkflow();
 *
 * // When a tool needs approval
 * const request = await workflow.requestApproval({
 *   sessionId: 'sess_123',
 *   agentId: 'support.bot.v1',
 *   toolName: 'delete_account',
 *   toolCallId: 'call_abc',
 *   toolArgs: { userId: 'user_123' },
 *   reason: 'Account deletion requires human approval',
 * });
 *
 * // When approval is granted
 * await workflow.approve(request.id, 'admin@example.com', 'Verified identity');
 *
 * // Or rejected
 * await workflow.reject(request.id, 'admin@example.com', 'Suspicious activity');
 * ```
 */
export class ApprovalWorkflow {
  constructor(
    private readonly store: ApprovalStore = new InMemoryApprovalStore()
  ) {}

  /**
   * Request approval for a tool execution.
   */
  async requestApproval(params: {
    sessionId: string;
    agentId: string;
    tenantId?: string;
    toolName: string;
    toolCallId: string;
    toolArgs: unknown;
    reason: string;
    payload?: Record<string, unknown>;
  }): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      id: randomUUID(),
      sessionId: params.sessionId,
      agentId: params.agentId,
      tenantId: params.tenantId,
      toolName: params.toolName,
      toolCallId: params.toolCallId,
      toolArgs: params.toolArgs,
      reason: params.reason,
      requestedAt: new Date(),
      status: 'pending',
      payload: params.payload,
    };

    await this.store.create(request);
    return request;
  }

  /**
   * Request approval from an AI SDK tool call.
   */
  async requestApprovalFromToolCall(
    toolCall: ToolCallInfo,
    context: {
      sessionId: string;
      agentId: string;
      tenantId?: string;
      reason?: string;
    }
  ): Promise<ApprovalRequest> {
    return this.requestApproval({
      sessionId: context.sessionId,
      agentId: context.agentId,
      tenantId: context.tenantId,
      toolName: toolCall.toolName,
      toolCallId: toolCall.toolCallId,
      toolArgs: toolCall.args,
      reason:
        context.reason ??
        getDefaultI18n().t('approval.toolRequiresApproval', {
          name: toolCall.toolName,
        }),
    });
  }

  /**
   * Approve a pending request.
   */
  async approve(id: string, reviewer: string, notes?: string): Promise<void> {
    await this.store.update(id, {
      status: 'approved',
      reviewer,
      resolvedAt: new Date(),
      notes,
    });
  }

  /**
   * Reject a pending request.
   */
  async reject(id: string, reviewer: string, notes?: string): Promise<void> {
    await this.store.update(id, {
      status: 'rejected',
      reviewer,
      resolvedAt: new Date(),
      notes,
    });
  }

  /**
   * Get approval status for a tool call.
   */
  async getStatus(toolCallId: string): Promise<ApprovalStatus | null> {
    const request = await this.store.getByToolCallId(toolCallId);
    return request?.status ?? null;
  }

  /**
   * Check if a tool call is approved.
   */
  async isApproved(toolCallId: string): Promise<boolean> {
    const status = await this.getStatus(toolCallId);
    return status === 'approved';
  }

  /**
   * List pending approvals.
   */
  async listPending(options?: {
    agentId?: string;
    tenantId?: string;
  }): Promise<ApprovalRequest[]> {
    return this.store.list({ ...options, status: 'pending' });
  }

  /**
   * Get approval request by ID.
   */
  async get(id: string): Promise<ApprovalRequest | null> {
    return this.store.get(id);
  }
}

/**
 * Create an approval workflow instance.
 */
export function createApprovalWorkflow(
  store?: ApprovalStore | InMemoryApprovalStoreOptions
): ApprovalWorkflow {
  if (
    store &&
    typeof store === 'object' &&
    'create' in store &&
    typeof store.create === 'function'
  ) {
    return new ApprovalWorkflow(store as ApprovalStore);
  }

  const options = store as InMemoryApprovalStoreOptions | undefined;
  return new ApprovalWorkflow(new InMemoryApprovalStore(options));
}

import type { StateStore, WorkflowState, WorkflowStateFilters } from '../state';

function cloneState(state: WorkflowState): WorkflowState {
  return {
    ...state,
    data: deepCopy(state.data),
    history: state.history.map((execution) => ({
      ...execution,
      input: deepCopy(execution.input),
      output: deepCopy(execution.output),
      startedAt: new Date(execution.startedAt),
      completedAt: execution.completedAt
        ? new Date(execution.completedAt)
        : undefined,
    })),
    createdAt: new Date(state.createdAt),
    updatedAt: new Date(state.updatedAt),
  };
}

/**
 * Naive in-memory state store. Suitable for tests and single-node development
 * environments. Swap with a database-backed adapter in production.
 */
export class InMemoryStateStore implements StateStore {
  private readonly items = new Map<string, WorkflowState>();

  async create(state: WorkflowState): Promise<void> {
    if (this.items.has(state.workflowId))
      throw new Error(`Workflow state already exists: ${state.workflowId}`);
    this.items.set(state.workflowId, cloneState(state));
  }

  async get(workflowId: string): Promise<WorkflowState | undefined> {
    const state = this.items.get(workflowId);
    return state ? cloneState(state) : undefined;
  }

  async update(
    workflowId: string,
    updater: (current: WorkflowState) => WorkflowState
  ): Promise<WorkflowState> {
    const current = this.items.get(workflowId);
    if (!current) throw new Error(`Workflow state not found for ${workflowId}`);
    const next = cloneState(updater(cloneState(current)));
    this.items.set(workflowId, next);
    return cloneState(next);
  }

  async list(filters?: WorkflowStateFilters): Promise<WorkflowState[]> {
    const all = [...this.items.values()];
    const filtered = filters?.status
      ? all.filter((state) => state.status === filters.status)
      : all;
    return filtered.map(cloneState);
  }

  clear() {
    this.items.clear();
  }
}

function deepCopy<T>(value: T): T {
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (Array.isArray(value)) return value.map((item) => deepCopy(item)) as T;
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = deepCopy(val);
    }
    return result as T;
  }
  return value;
}

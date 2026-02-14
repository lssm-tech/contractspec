import type { WorkflowStatus } from './spec';

export interface StepExecution {
  stepId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: unknown;
  output?: unknown;
  error?: string;
}

export interface WorkflowState {
  workflowId: string;
  workflowName: string;
  workflowVersion: string;
  currentStep: string;
  data: Record<string, unknown>;
  retryCounts?: Record<string, number>;
  history: StepExecution[];
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStateFilters {
  status?: WorkflowStatus;
}

export interface StateStore {
  create(state: WorkflowState): Promise<void>;
  get(workflowId: string): Promise<WorkflowState | undefined>;
  update(
    workflowId: string,
    updater: (current: WorkflowState) => WorkflowState
  ): Promise<WorkflowState>;
  list(filters?: WorkflowStateFilters): Promise<WorkflowState[]>;
}

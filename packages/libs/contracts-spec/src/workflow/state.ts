import type { ContractProblem, ContractSuccess } from '../results';
import type { WorkflowStatus } from './spec';

export type WorkflowWaitReason =
	| 'approval'
	| 'hook'
	| 'human_input'
	| 'retry'
	| 'stream'
	| 'webhook';

export interface StepExecution {
	stepId: string;
	startedAt: Date;
	completedAt?: Date;
	status: 'pending' | 'running' | 'waiting' | 'completed' | 'failed';
	input?: unknown;
	output?: unknown;
	result?: ContractSuccess<unknown, string>;
	error?: string;
	problem?: ContractProblem<string, Record<string, unknown>>;
}

export interface WorkflowWaitState {
	reason: WorkflowWaitReason;
	stepId: string;
	requestedAt: Date;
	retryAt?: Date;
	metadata?: Record<string, string>;
}

export interface WorkflowState<
	Data extends Record<string, unknown> = Record<string, unknown>,
> {
	workflowId: string;
	traceId?: string;
	workflowName: string;
	workflowVersion: string;
	currentStep: string;
	data: Data;
	result?: ContractSuccess<unknown, string>;
	problem?: ContractProblem<string, Record<string, unknown>>;
	retryCounts?: Record<string, number>;
	history: StepExecution[];
	status: WorkflowStatus;
	wait?: WorkflowWaitState;
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

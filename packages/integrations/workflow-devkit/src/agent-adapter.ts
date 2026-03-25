import type {
	AgentCheckpointEnvelope,
	AgentRuntimeAdapterBundle,
} from '@contractspec/lib.ai-agent/interop';
import type { AgentSessionState } from '@contractspec/lib.ai-agent/types';
import type { WorkflowApiLike } from './types';

export interface WorkflowDevkitSuspensionState {
	input?: string;
	metadata?: Record<string, string>;
	reason: string;
	resumedAt?: Date;
	suspendedAt: Date;
}

export interface WorkflowDevkitSuspensionStore {
	clear(sessionId: string): Promise<void>;
	get(sessionId: string): Promise<WorkflowDevkitSuspensionState | null>;
	set(sessionId: string, state: WorkflowDevkitSuspensionState): Promise<void>;
}

export interface CreateWorkflowDevkitAgentRuntimeAdapterOptions {
	checkpointStore?: InMemoryWorkflowDevkitCheckpointStore;
	resolveSessionToken?: (sessionId: string) => string;
	suspensionStore?: WorkflowDevkitSuspensionStore;
	workflowApi?: Pick<WorkflowApiLike, 'resumeHook'>;
}

export class InMemoryWorkflowDevkitCheckpointStore {
	private readonly envelopes = new Map<string, AgentCheckpointEnvelope>();

	async delete(sessionId: string): Promise<void> {
		this.envelopes.delete(sessionId);
	}

	async load(sessionId: string): Promise<AgentCheckpointEnvelope | null> {
		return this.envelopes.get(sessionId) ?? null;
	}

	async save(envelope: AgentCheckpointEnvelope): Promise<void> {
		this.envelopes.set(envelope.sessionId, envelope);
	}
}

export class InMemoryWorkflowDevkitSuspensionStore
	implements WorkflowDevkitSuspensionStore
{
	private readonly states = new Map<string, WorkflowDevkitSuspensionState>();

	async clear(sessionId: string): Promise<void> {
		this.states.delete(sessionId);
	}

	async get(sessionId: string): Promise<WorkflowDevkitSuspensionState | null> {
		return this.states.get(sessionId) ?? null;
	}

	async set(
		sessionId: string,
		state: WorkflowDevkitSuspensionState
	): Promise<void> {
		this.states.set(sessionId, state);
	}
}

export function createWorkflowDevkitAgentRuntimeAdapterBundle(
	options: CreateWorkflowDevkitAgentRuntimeAdapterOptions = {}
): AgentRuntimeAdapterBundle<AgentSessionState> {
	const checkpointStore =
		options.checkpointStore ?? new InMemoryWorkflowDevkitCheckpointStore();
	const suspensionStore =
		options.suspensionStore ?? new InMemoryWorkflowDevkitSuspensionStore();
	const resolveSessionToken =
		options.resolveSessionToken ?? defaultWorkflowDevkitAgentToken;

	return {
		key: 'workflow-devkit',
		checkpoint: {
			delete(sessionId) {
				return checkpointStore.delete(sessionId);
			},
			load(sessionId) {
				return checkpointStore.load(sessionId);
			},
			save(envelope) {
				return checkpointStore.save(envelope);
			},
		},
		suspendResume: {
			async resume(params) {
				await suspensionStore.set(params.sessionId, {
					input: params.input,
					metadata: params.metadata,
					reason: 'resumed',
					resumedAt: new Date(),
					suspendedAt: new Date(),
				});
				if (options.workflowApi) {
					await options.workflowApi.resumeHook(
						resolveSessionToken(params.sessionId),
						{
							input: params.input,
							metadata: params.metadata,
							sessionId: params.sessionId,
						}
					);
				}
			},
			async suspend(params) {
				await suspensionStore.set(params.sessionId, {
					metadata: params.metadata,
					reason: params.reason,
					suspendedAt: new Date(),
				});
			},
		},
	};
}

export function defaultWorkflowDevkitAgentToken(sessionId: string): string {
	return `agent-session:${sessionId}`;
}

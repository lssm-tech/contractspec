/**
 * Hook for Agent Console mutations (commands)
 *
 * Uses runtime-local database-backed handlers for:
 * - CreateAgentCommand
 * - UpdateAgentCommand
 */

import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';
import { useCallback, useState } from 'react';
import type {
	Agent,
	AgentHandlers,
	CreateAgentInput,
	Run,
	UpdateAgentInput,
} from '../../handlers/agent.handlers';
import { AGENT_CONSOLE_DEMO_ORGANIZATION_ID } from '../../shared/demo-runtime-seed';

export interface MutationState<T> {
	loading: boolean;
	error: Error | null;
	data: T | null;
}

export interface UseAgentMutationsOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

function normalizeMutationError(
	error: unknown,
	fallbackMessage: string
): Error {
	return error instanceof Error ? error : new Error(fallbackMessage);
}

export function useAgentMutations(options: UseAgentMutationsOptions = {}) {
	const { handlers, projectId } = useTemplateRuntime<{
		agent: AgentHandlers;
	}>();
	const { agent } = handlers;

	const [createState, setCreateState] = useState<MutationState<Agent>>({
		loading: false,
		error: null,
		data: null,
	});

	const [updateState, setUpdateState] = useState<MutationState<Agent>>({
		loading: false,
		error: null,
		data: null,
	});

	const [executeState, setExecuteState] = useState<MutationState<Run>>({
		loading: false,
		error: null,
		data: null,
	});

	/**
	 * Create a new agent
	 */
	const createAgent = useCallback(
		async (input: CreateAgentInput): Promise<Agent | null> => {
			setCreateState({ loading: true, error: null, data: null });
			try {
				const result = await agent.createAgent(input, {
					projectId,
					organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
				});
				setCreateState({ loading: false, error: null, data: result });
				options.onSuccess?.();
				return result;
			} catch (err) {
				const error = normalizeMutationError(err, 'Failed to create agent');
				setCreateState({ loading: false, error, data: null });
				options.onError?.(error);
				throw error;
			}
		},
		[agent, projectId, options]
	);

	/**
	 * Update an agent (name, status)
	 */
	const updateAgent = useCallback(
		async (input: UpdateAgentInput): Promise<Agent | null> => {
			setUpdateState({ loading: true, error: null, data: null });
			try {
				const result = await agent.updateAgent(input);
				setUpdateState({ loading: false, error: null, data: result });
				options.onSuccess?.();
				return result;
			} catch (err) {
				const error = normalizeMutationError(err, 'Failed to update agent');
				setUpdateState({ loading: false, error, data: null });
				options.onError?.(error);
				throw error;
			}
		},
		[agent, options]
	);

	/**
	 * Activate an agent
	 */
	const activateAgent = useCallback(
		async (agentId: string): Promise<Agent | null> => {
			return updateAgent({ id: agentId, status: 'ACTIVE' });
		},
		[updateAgent]
	);

	/**
	 * Pause an agent
	 */
	const pauseAgent = useCallback(
		async (agentId: string): Promise<Agent | null> => {
			return updateAgent({ id: agentId, status: 'PAUSED' });
		},
		[updateAgent]
	);

	/**
	 * Archive an agent
	 */
	const archiveAgent = useCallback(
		async (agentId: string): Promise<Agent | null> => {
			return updateAgent({ id: agentId, status: 'ARCHIVED' });
		},
		[updateAgent]
	);

	/**
	 * Execute an agent (creates a queued run).
	 */
	const executeAgent = useCallback(
		async (input: {
			agentId: string;
			message: string;
		}): Promise<Run | null> => {
			setExecuteState({ loading: true, error: null, data: null });
			try {
				const result = await agent.executeAgent({
					agentId: input.agentId,
					message: input.message,
					context: {
						projectId,
						organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
					},
				});
				setExecuteState({ loading: false, error: null, data: result });
				options.onSuccess?.();
				return result;
			} catch (err) {
				const error = normalizeMutationError(err, 'Failed to execute agent');
				setExecuteState({ loading: false, error, data: null });
				options.onError?.(error);
				throw error;
			}
		},
		[agent, projectId, options]
	);

	return {
		// Mutations
		createAgent,
		updateAgent,
		activateAgent,
		pauseAgent,
		archiveAgent,
		executeAgent,

		// State
		createState,
		updateState,
		executeState,

		// Convenience
		isLoading:
			createState.loading || updateState.loading || executeState.loading,
	};
}

// Re-export types for convenience
export type { Agent, CreateAgentInput, Run, UpdateAgentInput };

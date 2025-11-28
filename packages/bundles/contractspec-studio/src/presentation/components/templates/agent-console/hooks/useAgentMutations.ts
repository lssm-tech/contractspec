/**
 * Hook for Agent Console mutations (commands)
 *
 * Wires UI actions to ContractSpec command handlers:
 * - CreateAgentCommand -> mockCreateAgentHandler
 * - UpdateAgentCommand -> mockUpdateAgentHandler
 * - ExecuteAgentCommand -> mockExecuteAgentHandler
 * - CancelRunCommand -> mockCancelRunHandler
 */
import { useCallback, useState } from 'react';
import {
  mockCancelRunHandler,
  mockCreateAgentHandler,
  mockExecuteAgentHandler,
  mockUpdateAgentHandler,
} from '@lssm/example.agent-console/handlers/index';

export interface CreateAgentInput {
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  modelProvider: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'MISTRAL' | 'CUSTOM';
  modelName: string;
  systemPrompt: string;
}

export interface UpdateAgentInput {
  agentId: string;
  name?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
}

export interface ExecuteAgentInput {
  agentId: string;
  message: string;
  context?: Record<string, unknown>;
  sessionId?: string;
}

export interface CancelRunInput {
  runId: string;
  reason?: string;
}

export interface MutationState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export interface UseAgentMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAgentMutations(options: UseAgentMutationsOptions = {}) {
  const [createState, setCreateState] = useState<
    MutationState<{ id: string; name: string; slug: string; status: string }>
  >({
    loading: false,
    error: null,
    data: null,
  });

  const [updateState, setUpdateState] = useState<
    MutationState<{ id: string; name: string; status: string; updatedAt: Date }>
  >({
    loading: false,
    error: null,
    data: null,
  });

  const [executeState, setExecuteState] = useState<
    MutationState<{ runId: string; status: string }>
  >({
    loading: false,
    error: null,
    data: null,
  });

  const [cancelState, setCancelState] = useState<
    MutationState<{ success: boolean; status: string }>
  >({
    loading: false,
    error: null,
    data: null,
  });

  /**
   * Create a new agent
   */
  const createAgent = useCallback(
    async (input: CreateAgentInput) => {
      setCreateState({ loading: true, error: null, data: null });
      try {
        const result = await mockCreateAgentHandler(input);
        setCreateState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to create agent');
        setCreateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  /**
   * Update an agent (name, status)
   */
  const updateAgent = useCallback(
    async (input: UpdateAgentInput) => {
      setUpdateState({ loading: true, error: null, data: null });
      try {
        const result = await mockUpdateAgentHandler(input);
        setUpdateState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to update agent');
        setUpdateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  /**
   * Activate an agent
   */
  const activateAgent = useCallback(
    async (agentId: string) => {
      return updateAgent({ agentId, status: 'ACTIVE' });
    },
    [updateAgent]
  );

  /**
   * Pause an agent
   */
  const pauseAgent = useCallback(
    async (agentId: string) => {
      return updateAgent({ agentId, status: 'PAUSED' });
    },
    [updateAgent]
  );

  /**
   * Archive an agent
   */
  const archiveAgent = useCallback(
    async (agentId: string) => {
      return updateAgent({ agentId, status: 'ARCHIVED' });
    },
    [updateAgent]
  );

  /**
   * Execute an agent
   */
  const executeAgent = useCallback(
    async (input: ExecuteAgentInput) => {
      setExecuteState({ loading: true, error: null, data: null });
      try {
        const result = await mockExecuteAgentHandler({
          agentId: input.agentId,
          input: {
            message: input.message,
            context: input.context,
          },
          sessionId: input.sessionId,
        });
        setExecuteState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to execute agent');
        setExecuteState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  /**
   * Cancel a running run
   */
  const cancelRun = useCallback(
    async (input: CancelRunInput) => {
      setCancelState({ loading: true, error: null, data: null });
      try {
        const result = await mockCancelRunHandler(input);
        setCancelState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to cancel run');
        setCancelState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  return {
    // Mutations
    createAgent,
    updateAgent,
    activateAgent,
    pauseAgent,
    archiveAgent,
    executeAgent,
    cancelRun,

    // State
    createState,
    updateState,
    executeState,
    cancelState,

    // Convenience
    isLoading:
      createState.loading ||
      updateState.loading ||
      executeState.loading ||
      cancelState.loading,
  };
}

/**
 * Hook for Agent Console mutations (commands)
 *
 * Uses runtime-local database-backed handlers for:
 * - CreateAgentCommand
 * - UpdateAgentCommand
 */
import { useCallback, useState } from 'react';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';
import type {
  Agent,
  CreateAgentInput,
  UpdateAgentInput,
  AgentHandlers,
} from '../../handlers/agent.handlers';

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

  /**
   * Create a new agent
   */
  const createAgent = useCallback(
    async (input: CreateAgentInput): Promise<Agent | null> => {
      setCreateState({ loading: true, error: null, data: null });
      try {
        const result = await agent.createAgent(input, {
          projectId,
          organizationId: 'demo-org',
        });
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
        const error =
          err instanceof Error ? err : new Error('Failed to update agent');
        setUpdateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
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
   * Execute an agent (placeholder - needs run handler)
   * Note: Execute functionality requires adding createRun/executeRun to agent handlers
   */
  const executeAgent = useCallback(
    async (input: { agentId: string; message: string }): Promise<null> => {
      // TODO: Implement execute when run creation handler is added to runtime-local
      console.log('Execute agent:', input);
      options.onSuccess?.();
      return null;
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

    // State
    createState,
    updateState,

    // Convenience
    isLoading: createState.loading || updateState.loading,
  };
}

// Re-export types for convenience
export type { CreateAgentInput, UpdateAgentInput, Agent };

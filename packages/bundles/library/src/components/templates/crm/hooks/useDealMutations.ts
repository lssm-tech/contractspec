/**
 * Hook for CRM deal mutations (commands)
 *
 * Uses runtime-local database-backed handlers for:
 * - CreateDealContract
 * - MoveDealContract
 * - WinDealContract
 * - LoseDealContract
 */
import { useState, useCallback } from 'react';
import { useTemplateRuntime } from '../../../../lib/runtime';
import type {
  CreateDealInput,
  MoveDealInput,
  WinDealInput,
  LoseDealInput,
  Deal,
} from '../../../../infrastructure/runtime-local-web';

export interface MutationState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export interface UseDealMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDealMutations(options: UseDealMutationsOptions = {}) {
  const { handlers, projectId } = useTemplateRuntime();
  const { crm } = handlers;

  const [createState, setCreateState] = useState<MutationState<Deal>>({
    loading: false,
    error: null,
    data: null,
  });

  const [moveState, setMoveState] = useState<MutationState<Deal>>({
    loading: false,
    error: null,
    data: null,
  });

  const [winState, setWinState] = useState<MutationState<Deal>>({
    loading: false,
    error: null,
    data: null,
  });

  const [loseState, setLoseState] = useState<MutationState<Deal>>({
    loading: false,
    error: null,
    data: null,
  });

  /**
   * Create a new deal
   */
  const createDeal = useCallback(
    async (input: CreateDealInput): Promise<Deal | null> => {
      setCreateState({ loading: true, error: null, data: null });
      try {
        const result = await crm.createDeal(input, {
          projectId,
          ownerId: 'user-1', // Demo user
        });
        setCreateState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to create deal');
        setCreateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [crm, projectId, options]
  );

  /**
   * Move a deal to a different stage
   */
  const moveDeal = useCallback(
    async (input: MoveDealInput): Promise<Deal | null> => {
      setMoveState({ loading: true, error: null, data: null });
      try {
        const result = await crm.moveDeal(input);
        setMoveState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to move deal');
        setMoveState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [crm, options]
  );

  /**
   * Mark a deal as won
   */
  const winDeal = useCallback(
    async (input: WinDealInput): Promise<Deal | null> => {
      setWinState({ loading: true, error: null, data: null });
      try {
        const result = await crm.winDeal(input);
        setWinState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to mark deal as won');
        setWinState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [crm, options]
  );

  /**
   * Mark a deal as lost
   */
  const loseDeal = useCallback(
    async (input: LoseDealInput): Promise<Deal | null> => {
      setLoseState({ loading: true, error: null, data: null });
      try {
        const result = await crm.loseDeal(input);
        setLoseState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to mark deal as lost');
        setLoseState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [crm, options]
  );

  return {
    // Mutations
    createDeal,
    moveDeal,
    winDeal,
    loseDeal,

    // State
    createState,
    moveState,
    winState,
    loseState,

    // Convenience
    isLoading:
      createState.loading ||
      moveState.loading ||
      winState.loading ||
      loseState.loading,
  };
}

// Note: Types are re-exported from the handlers package
// Consumers should import types directly from '@contractspec/example.crm-pipeline/handlers'

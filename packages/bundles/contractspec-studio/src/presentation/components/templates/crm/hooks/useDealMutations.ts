/**
 * Hook for CRM deal mutations (commands)
 *
 * Wires UI actions to ContractSpec command handlers:
 * - CreateDealContract -> mockCreateDealHandler
 * - MoveDealContract -> mockMoveDealHandler
 * - WinDealContract -> mockWinDealHandler
 * - LoseDealContract -> mockLoseDealHandler
 */
import { useState, useCallback } from 'react';
import {
  mockCreateDealHandler,
  mockMoveDealHandler,
  mockWinDealHandler,
  mockLoseDealHandler,
  type CreateDealInput,
  type MoveDealInput,
  type WinDealInput,
  type LoseDealInput,
  type Deal,
} from '@lssm/example.crm-pipeline/handlers';

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
        const result = await mockCreateDealHandler(input, {
          ownerId: 'user-1', // Demo user
        });
        setCreateState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create deal');
        setCreateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  /**
   * Move a deal to a different stage
   */
  const moveDeal = useCallback(
    async (input: MoveDealInput): Promise<Deal | null> => {
      setMoveState({ loading: true, error: null, data: null });
      try {
        const result = await mockMoveDealHandler(input);
        setMoveState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to move deal');
        setMoveState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  /**
   * Mark a deal as won
   */
  const winDeal = useCallback(
    async (input: WinDealInput): Promise<Deal | null> => {
      setWinState({ loading: true, error: null, data: null });
      try {
        const result = await mockWinDealHandler(input);
        setWinState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to mark deal as won');
        setWinState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  /**
   * Mark a deal as lost
   */
  const loseDeal = useCallback(
    async (input: LoseDealInput): Promise<Deal | null> => {
      setLoseState({ loading: true, error: null, data: null });
      try {
        const result = await mockLoseDealHandler(input);
        setLoseState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to mark deal as lost');
        setLoseState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
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
// Consumers should import types directly from '@lssm/example.crm-pipeline/handlers'


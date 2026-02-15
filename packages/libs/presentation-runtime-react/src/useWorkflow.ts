import * as React from 'react';
import type {
  WorkflowRunner,
  WorkflowState,
} from '@contractspec/lib.contracts-spec/workflow';

export interface UseWorkflowOptions {
  workflowId: string;
  runner: WorkflowRunner;
  autoRefresh?: boolean;
  refreshIntervalMs?: number;
}

export interface UseWorkflowResult {
  state: WorkflowState | null;
  isLoading: boolean;
  error: Error | null;
  isExecuting: boolean;
  refresh: () => Promise<void>;
  executeStep: (input?: unknown) => Promise<void>;
  cancel: () => Promise<void>;
}

export function useWorkflow({
  workflowId,
  runner,
  autoRefresh = true,
  refreshIntervalMs = 2000,
}: UseWorkflowOptions): UseWorkflowResult {
  const isMounted = React.useRef(true);
  const [state, setState] = React.useState<WorkflowState | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [isExecuting, setIsExecuting] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const next = await runner.getState(workflowId);
      if (!isMounted.current) return;
      setState(next);
      setError(null);
    } catch (err) {
      if (!isMounted.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [runner, workflowId]);

  const executeStep = React.useCallback(
    async (input?: unknown) => {
      setIsExecuting(true);
      try {
        await runner.executeStep(workflowId, input);
        await refresh();
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
        throw err;
      } finally {
        if (isMounted.current) setIsExecuting(false);
      }
    },
    [runner, workflowId, refresh]
  );

  const cancel = React.useCallback(async () => {
    await runner.cancel(workflowId);
    await refresh();
  }, [runner, workflowId, refresh]);

  React.useEffect(() => {
    isMounted.current = true;
    void refresh();
    if (!autoRefresh) {
      return () => {
        isMounted.current = false;
      };
    }
    const interval = setInterval(() => {
      void refresh();
    }, refreshIntervalMs);
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [refresh, autoRefresh, refreshIntervalMs]);

  return {
    state,
    isLoading,
    error,
    isExecuting,
    refresh,
    executeStep,
    cancel,
  };
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  WorkflowDefinition,
  WorkflowInstance,
} from '@lssm/lib.runtime-local';
import { useWorkflowHandlers } from '../../../../../templates/runtime';

export interface WorkflowStats {
  totalDefinitions: number;
  activeDefinitions: number;
  totalInstances: number;
  pendingInstances: number;
  completedInstances: number;
  rejectedInstances: number;
}

export function useWorkflowList(projectId = 'local-project') {
  const handlers = useWorkflowHandlers();
  const [definitions, setDefinitions] = useState<WorkflowDefinition[]>([]);
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [defResult, instResult] = await Promise.all([
        handlers.listDefinitions({ projectId, limit: 100 }),
        handlers.listInstances({ projectId, limit: 100 }),
      ]);

      setDefinitions(defResult.definitions);
      setInstances(instResult.instances);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load workflows')
      );
    } finally {
      setLoading(false);
    }
  }, [handlers, projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats: WorkflowStats = {
    totalDefinitions: definitions.length,
    activeDefinitions: definitions.filter((d) => d.status === 'ACTIVE').length,
    totalInstances: instances.length,
    pendingInstances: instances.filter((i) => i.status === 'PENDING').length,
    completedInstances: instances.filter((i) => i.status === 'COMPLETED')
      .length,
    rejectedInstances: instances.filter((i) => i.status === 'REJECTED').length,
  };

  return {
    definitions,
    instances,
    loading,
    error,
    stats,
    refetch: fetchData,
  };
}


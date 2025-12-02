/**
 * Hook for SaaS project mutations (commands)
 *
 * Uses runtime-local database-backed handlers for:
 * - CreateProjectContract
 * - UpdateProjectContract
 * - DeleteProjectContract
 */
import { useState, useCallback } from 'react';
import { useTemplateRuntime } from '../../../../../templates/runtime';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  Project,
} from '@lssm/lib.runtime-local';

export interface MutationState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export interface UseProjectMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useProjectMutations(options: UseProjectMutationsOptions = {}) {
  const { handlers, projectId } = useTemplateRuntime();
  const { saas } = handlers;

  const [createState, setCreateState] = useState<MutationState<Project>>({
    loading: false,
    error: null,
    data: null,
  });

  const [updateState, setUpdateState] = useState<MutationState<Project>>({
    loading: false,
    error: null,
    data: null,
  });

  const [deleteState, setDeleteState] = useState<
    MutationState<{ success: boolean }>
  >({
    loading: false,
    error: null,
    data: null,
  });

  /**
   * Create a new project
   */
  const createProject = useCallback(
    async (input: CreateProjectInput): Promise<Project | null> => {
      setCreateState({ loading: true, error: null, data: null });
      try {
        const result = await saas.createProject(input, {
          projectId,
          organizationId: 'demo-org',
        });
        setCreateState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to create project');
        setCreateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [saas, projectId, options]
  );

  /**
   * Update a project
   */
  const updateProject = useCallback(
    async (input: UpdateProjectInput): Promise<Project | null> => {
      setUpdateState({ loading: true, error: null, data: null });
      try {
        const result = await saas.updateProject(input);
        setUpdateState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to update project');
        setUpdateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [saas, options]
  );

  /**
   * Delete a project (soft delete)
   */
  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      setDeleteState({ loading: true, error: null, data: null });
      try {
        await saas.deleteProject(id);
        setDeleteState({
          loading: false,
          error: null,
          data: { success: true },
        });
        options.onSuccess?.();
        return true;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to delete project');
        setDeleteState({ loading: false, error, data: null });
        options.onError?.(error);
        return false;
      }
    },
    [saas, options]
  );

  /**
   * Archive a project (status change)
   */
  const archiveProject = useCallback(
    async (id: string): Promise<Project | null> => {
      return updateProject({ id, status: 'ARCHIVED' });
    },
    [updateProject]
  );

  /**
   * Activate a project (status change)
   */
  const activateProject = useCallback(
    async (id: string): Promise<Project | null> => {
      return updateProject({ id, status: 'ACTIVE' });
    },
    [updateProject]
  );

  return {
    // Mutations
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    activateProject,

    // State
    createState,
    updateState,
    deleteState,

    // Convenience
    isLoading:
      createState.loading || updateState.loading || deleteState.loading,
  };
}

// Note: Types are re-exported from the handlers package
// Consumers should import types directly from '@lssm/example.saas-boilerplate/handlers'

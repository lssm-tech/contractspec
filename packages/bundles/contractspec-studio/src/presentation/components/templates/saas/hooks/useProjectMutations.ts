/**
 * Hook for SaaS project mutations (commands)
 *
 * Wires UI actions to ContractSpec command handlers:
 * - CreateProjectContract -> mockCreateProjectHandler
 * - UpdateProjectContract -> mockUpdateProjectHandler
 * - DeleteProjectContract -> mockDeleteProjectHandler
 */
import { useState, useCallback } from 'react';
import {
  mockCreateProjectHandler,
  mockUpdateProjectHandler,
  mockDeleteProjectHandler,
  type CreateProjectInput,
  type UpdateProjectInput,
  type Project,
} from '@lssm/example.saas-boilerplate/handlers';

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

  const [deleteState, setDeleteState] = useState<MutationState<{ success: boolean }>>({
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
        const result = await mockCreateProjectHandler(input, {
          organizationId: 'demo-org',
          userId: 'demo-user',
        });
        setCreateState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create project');
        setCreateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  /**
   * Update a project
   */
  const updateProject = useCallback(
    async (input: UpdateProjectInput): Promise<Project | null> => {
      setUpdateState({ loading: true, error: null, data: null });
      try {
        const result = await mockUpdateProjectHandler(input);
        setUpdateState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update project');
        setUpdateState({ loading: false, error, data: null });
        options.onError?.(error);
        return null;
      }
    },
    [options]
  );

  /**
   * Delete a project (soft delete)
   */
  const deleteProject = useCallback(
    async (projectId: string): Promise<boolean> => {
      setDeleteState({ loading: true, error: null, data: null });
      try {
        const result = await mockDeleteProjectHandler({ projectId });
        setDeleteState({ loading: false, error: null, data: result });
        options.onSuccess?.();
        return result.success;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete project');
        setDeleteState({ loading: false, error, data: null });
        options.onError?.(error);
        return false;
      }
    },
    [options]
  );

  /**
   * Archive a project (status change)
   */
  const archiveProject = useCallback(
    async (projectId: string): Promise<Project | null> => {
      return updateProject({ projectId, status: 'ARCHIVED' });
    },
    [updateProject]
  );

  /**
   * Activate a project (status change)
   */
  const activateProject = useCallback(
    async (projectId: string): Promise<Project | null> => {
      return updateProject({ projectId, status: 'ACTIVE' });
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
    isLoading: createState.loading || updateState.loading || deleteState.loading,
  };
}

// Note: Types are re-exported from the handlers package
// Consumers should import types directly from '@lssm/example.saas-boilerplate/handlers'


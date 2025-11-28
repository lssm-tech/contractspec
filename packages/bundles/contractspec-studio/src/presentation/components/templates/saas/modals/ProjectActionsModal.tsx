'use client';

/**
 * ProjectActionsModal - Actions for a specific project
 *
 * Wires to UpdateProjectContract, DeleteProjectContract
 * via useProjectMutations hook.
 */
import { useState } from 'react';
import { Button, Input } from '@lssm/lib.design-system';
import type { Project, UpdateProjectInput } from '@lssm/example.saas-boilerplate/handlers';

type ActionMode = 'menu' | 'edit' | 'archive' | 'delete';

interface ProjectActionsModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onUpdate: (input: UpdateProjectInput) => Promise<void>;
  onArchive: (projectId: string) => Promise<void>;
  onActivate: (projectId: string) => Promise<void>;
  onDelete: (projectId: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProjectActionsModal({
  isOpen,
  project,
  onClose,
  onUpdate,
  onArchive,
  onActivate,
  onDelete,
  isLoading = false,
}: ProjectActionsModalProps) {
  const [mode, setMode] = useState<ActionMode>('menu');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setMode('menu');
    setError(null);
    if (project) {
      setName(project.name);
      setDescription(project.description ?? '');
      setIsPublic(project.isPublic);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Initialize form when project changes
  useState(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description ?? '');
      setIsPublic(project.isPublic);
    }
  });

  const handleEdit = async () => {
    if (!project) return;
    setError(null);

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await onUpdate({
        projectId: project.id,
        name: name.trim(),
        description: description.trim() || undefined,
        isPublic,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    }
  };

  const handleArchive = async () => {
    if (!project) return;
    setError(null);

    try {
      await onArchive(project.id);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive project');
    }
  };

  const handleActivate = async () => {
    if (!project) return;
    setError(null);

    try {
      await onActivate(project.id);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate project');
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    setError(null);

    try {
      await onDelete(project.id);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="bg-card border-border relative z-10 w-full max-w-md rounded-xl border p-6 shadow-xl">
        {/* Project Header */}
        <div className="border-border mb-4 border-b pb-4">
          <h2 className="text-xl font-semibold">{project.name}</h2>
          <p className="text-muted-foreground text-sm">
            {project.slug && <>/{project.slug} · </>}
            {project.status}
          </p>
        </div>

        {/* Main Menu */}
        {mode === 'menu' && (
          <div className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="ghost"
              onPress={() => setMode('edit')}
            >
              <span className="mr-2">✏️</span> Edit Project
            </Button>

            {project.status === 'ACTIVE' || project.status === 'DRAFT' ? (
              <Button
                className="w-full justify-start"
                variant="ghost"
                onPress={() => setMode('archive')}
              >
                <span className="mr-2">📦</span> Archive Project
              </Button>
            ) : project.status === 'ARCHIVED' ? (
              <Button
                className="w-full justify-start"
                variant="ghost"
                onPress={handleActivate}
                disabled={isLoading}
              >
                <span className="mr-2">🔄</span> Restore Project
              </Button>
            ) : null}

            <Button
              className="w-full justify-start text-red-500 hover:text-red-600"
              variant="ghost"
              onPress={() => setMode('delete')}
            >
              <span className="mr-2">🗑️</span> Delete Project
            </Button>

            <div className="border-border border-t pt-3">
              <Button
                className="w-full"
                variant="outline"
                onPress={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {mode === 'edit' && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="edit-name"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Project Name *
              </label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="edit-description"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isLoading}
                className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="edit-public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="edit-public" className="text-sm">
                Make this project public
              </label>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onPress={() => setMode('menu')}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button onPress={handleEdit} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}

        {/* Archive Confirmation */}
        {mode === 'archive' && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to archive{' '}
              <span className="text-foreground font-medium">{project.name}</span>?
            </p>
            <p className="text-muted-foreground text-sm">
              Archived projects can be restored later.
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onPress={() => setMode('menu')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onPress={handleArchive} disabled={isLoading}>
                {isLoading ? 'Archiving...' : '📦 Archive'}
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {mode === 'delete' && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="text-foreground font-medium">{project.name}</span>?
            </p>
            <p className="text-destructive text-sm">
              This action cannot be undone.
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onPress={() => setMode('menu')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onPress={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : '🗑️ Delete'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


'use client';

/**
 * CreateProjectModal - Form for creating a new project
 *
 * Wires to CreateProjectContract via useProjectMutations hook.
 */
import { useState } from 'react';
import { Button, Input } from '@lssm/lib.design-system';

// Local type definition for modal props
export interface CreateProjectInput {
  name: string;
  description?: string;
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProjectInput) => Promise<void>;
  isLoading?: boolean;
}

const TIERS: { value: CreateProjectInput['tier']; label: string }[] = [
  { value: 'FREE', label: 'Free' },
  { value: 'PRO', label: 'Pro' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
];

export function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<CreateProjectInput['tier']>('FREE');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        tier,
      });

      // Reset form
      setName('');
      setDescription('');
      setTier('FREE');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-card border-border relative z-10 w-full max-w-md rounded-xl border p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label
              htmlFor="project-name"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              Project Name *
            </label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Awesome Project"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="project-description"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this project is about..."
              rows={3}
              disabled={isLoading}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Tier */}
          <div>
            <label
              htmlFor="project-tier"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              Tier
            </label>
            <select
              id="project-tier"
              value={tier}
              onChange={(e) =>
                setTier(e.target.value as CreateProjectInput['tier'])
              }
              disabled={isLoading}
              className="border-input bg-background focus:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
            >
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onPress={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

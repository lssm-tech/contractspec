'use client';

/**
 * CreateProjectModal - Form for creating a new project
 *
 * Wires to CreateProjectContract via useProjectMutations hook.
 */
import { useState } from 'react';
import { Button, Input } from '@lssm/lib.design-system';
import type { CreateProjectInput } from '@lssm/example.saas-boilerplate/handlers';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProjectInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
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
        slug: slug.trim() || undefined,
        isPublic,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
      });

      // Reset form
      setName('');
      setDescription('');
      setSlug('');
      setIsPublic(false);
      setTagsInput('');
      onClose();
    } catch (err) {
      if (err instanceof Error && err.message === 'SLUG_EXISTS') {
        setError('A project with this slug already exists');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create project');
      }
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug) {
      // Only auto-generate if user hasn't customized the slug
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(autoSlug);
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
              onChange={(e) => handleNameChange(e)}
              placeholder="e.g., My Awesome Project"
              disabled={isLoading}
            />
          </div>

          {/* Project Slug */}
          <div>
            <label
              htmlFor="project-slug"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              URL Slug
            </label>
            <Input
              id="project-slug"
              value={slug}
              onChange={(e) => setSlug(e)}
              placeholder="my-awesome-project"
              disabled={isLoading}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Used in project URLs. Leave empty to auto-generate.
            </p>
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

          {/* Tags */}
          <div>
            <label
              htmlFor="project-tags"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              Tags
            </label>
            <Input
              id="project-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e)}
              placeholder="frontend, react, design-system"
              disabled={isLoading}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Comma-separated list of tags.
            </p>
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="project-public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="project-public" className="text-sm">
              Make this project public
            </label>
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


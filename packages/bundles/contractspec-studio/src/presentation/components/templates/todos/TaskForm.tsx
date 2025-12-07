'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

import { useTemplateRuntime } from '../../../../templates/runtime';
import { type TaskCategory, type TaskPriority } from './types';

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
    }
  }
`;

export interface TaskFormProps {
  categories: TaskCategory[];
}

export function TaskForm({ categories, onCreated }: TaskFormProps) {
  const { projectId } = useTemplateRuntime();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [categoryId, setCategoryId] = useState<string | 'none'>('none');
  const [tagsInput, setTagsInput] = useState('');
  const [createTask, { loading }] = useMutation(CREATE_TASK);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    await createTask({
      variables: {
        input: {
          projectId,
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          categoryId: categoryId === 'none' ? undefined : categoryId,
          tags: parseTags(tagsInput),
        },
      },
      refetchQueries: ['Tasks'],
      awaitRefetchQueries: true,
    });
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setCategoryId('none');
    setTagsInput('');
    onCreated?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-background/60 space-y-3 rounded-2xl border p-4"
    >
      <div>
        <label className="text-muted-foreground text-xs font-semibold uppercase">
          Title
        </label>
        <input
          type="text"
          className="border-border bg-card mt-1 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="What needs to get done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-muted-foreground text-xs font-semibold uppercase">
          Description
        </label>
        <textarea
          className="border-border bg-card mt-1 w-full rounded-md border px-3 py-2 text-sm"
          rows={3}
          placeholder="Add context or policy notes"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-muted-foreground text-xs font-semibold uppercase">
          Priority
          <select
            className="border-border bg-card mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </label>

        <label className="text-muted-foreground text-xs font-semibold uppercase">
          Category
          <select
            className="border-border bg-card mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value as string)}
          >
            <option value="none">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-muted-foreground text-xs font-semibold uppercase">
          Tags
          <input
            className="border-border bg-card mt-1 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Comma separated (optional)"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        className="btn-primary w-full py-2 text-sm font-semibold"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Add task'}
      </button>
    </form>
  );
}

function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

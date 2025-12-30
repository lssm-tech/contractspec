'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

import {
  registerTemplateComponents,
  useTemplateRuntime,
} from '../../../lib/runtime';
import { FilterBar, type FilterState } from './FilterBar';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { type Task, type TaskCategory } from './types';

const TASKS_QUERY = gql`
  query Tasks($projectId: ID!) {
    taskCategories(projectId: $projectId) {
      id
      name
      color
    }
    tasks(projectId: $projectId) {
      id
      title
      description
      completed
      priority
      dueDate
      tags
      category {
        id
        name
        color
      }
    }
  }
`;

const TOGGLE_TASK = gql`
  mutation ToggleTask($id: ID!, $completed: Boolean!) {
    toggleTask(id: $id, completed: $completed) {
      id
      completed
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export function TaskList() {
  const { projectId } = useTemplateRuntime();
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    priority: 'all',
    categoryId: 'all',
    search: '',
  });
  const { data, loading } = useQuery<{
    tasks: Task[];
    taskCategories: TaskCategory[];
  }>(TASKS_QUERY, {
    variables: { projectId },
    fetchPolicy: 'cache-and-network',
  });
  const [toggleTask] = useMutation(TOGGLE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const categories: TaskCategory[] = data?.taskCategories ?? [];
  const tasks: Task[] = data?.tasks ?? [];

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status === 'active' && task.completed) return false;
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority)
        return false;
      if (
        filters.categoryId !== 'all' &&
        task.category?.id !== filters.categoryId
      )
        return false;
      if (
        filters.search &&
        !task.title.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [tasks, filters]);

  const handleToggle = async (task: Task) => {
    await toggleTask({
      variables: { id: task.id, completed: !task.completed },
      optimisticResponse: {
        toggleTask: {
          __typename: 'Task',
          id: task.id,
          completed: !task.completed,
        },
      },
      update(cache) {
        cache.modify({
          fields: {
            tasks(existing = []) {
              return existing.map(
                (ref: { __ref?: string; completed?: boolean }) =>
                  ref.__ref?.endsWith(task.id)
                    ? { ...ref, completed: !task.completed }
                    : ref
              );
            },
          },
        });
      },
    });
  };

  const handleDelete = async (task: Task) => {
    await deleteTask({
      variables: { id: task.id },
      refetchQueries: [{ query: TASKS_QUERY, variables: { projectId } }],
    });
  };

  return (
    <div className="space-y-6">
      <FilterBar
        value={filters}
        onChange={setFilters}
        categories={categories}
      />
      <TaskForm categories={categories} />

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading tasks…</p>
      ) : filtered.length ? (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="border-border rounded-2xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No tasks match your filters. Create one above.
          </p>
        </div>
      )}
    </div>
  );
}

registerTemplateComponents('todos-app', {
  list: TaskList,
  detail: TaskList,
  form: TaskForm,
});

import { defineCapability, StabilityEnum } from '@lssm/lib.contracts';

const OWNERS = ['platform.contractspec-studio'] as const;

export const TaskCrudCapability = defineCapability({
  meta: {
    key: 'template.todos.crud',
    version: 1,
    kind: 'api',
    title: 'Template Tasks CRUD',
    description:
      'Create, read, update, delete, and toggle template tasks with categories and priorities.',
    domain: 'templates',
    owners: [...OWNERS],
    tags: ['templates', 'todos', 'productivity'],
    stability: StabilityEnum.Stable,
  },
  provides: [
    {
      surface: 'operation',
      name: 'template.task.create',
      version: 1,
      description: 'Create a new task for a Studio project template.',
    },
    {
      surface: 'operation',
      name: 'template.task.update',
      version: 1,
      description: 'Update task metadata such as title, due date, or category.',
    },
    {
      surface: 'operation',
      name: 'template.task.delete',
      version: 1,
      description: 'Delete or archive a task from a template project.',
    },
    {
      surface: 'operation',
      name: 'template.task.toggle',
      version: 1,
      description: 'Mark a task as completed or active.',
    },
    {
      surface: 'operation',
      name: 'template.task.list',
      version: 1,
      description: 'List tasks with filtering, search, and sorting.',
    },
    {
      surface: 'operation',
      name: 'template.task.category',
      version: 1,
      description: 'Manage categories and tags for tasks.',
    },
  ],
  requires: [{ key: 'studio.project', version: 1 }],
});











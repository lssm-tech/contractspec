import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts-spec';

const OWNERS = ['platform.contractspec-studio'] as const;

export const TaskCrudCapability = defineCapability({
  meta: {
    key: 'template.todos.crud',
    version: '1.0.0',
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
      key: 'template.task.create',
      version: '1.0.0',
      description: 'Create a new task for a Studio project template.',
    },
    {
      surface: 'operation',
      key: 'template.task.update',
      version: '1.0.0',
      description: 'Update task metadata such as title, due date, or category.',
    },
    {
      surface: 'operation',
      key: 'template.task.delete',
      version: '1.0.0',
      description: 'Delete or archive a task from a template project.',
    },
    {
      surface: 'operation',
      key: 'template.task.toggle',
      version: '1.0.0',
      description: 'Mark a task as completed or active.',
    },
    {
      surface: 'operation',
      key: 'template.task.list',
      version: '1.0.0',
      description: 'List tasks with filtering, search, and sorting.',
    },
    {
      surface: 'operation',
      key: 'template.task.category',
      version: '1.0.0',
      description: 'Manage categories and tags for tasks.',
    },
  ],
  requires: [{ key: 'studio.project', version: '1.0.0' }],
});

import {
  defineCommand,
  defineQuery,
} from '@contractspec/lib.contracts/operations';
import {
  CreateProjectInputModel,
  DeleteProjectInputModel,
  DeleteProjectOutputModel,
  GetProjectInputModel,
  ListProjectsInputModel,
  ListProjectsOutputModel,
  ProjectDeletedPayloadModel,
  ProjectModel,
  UpdateProjectInputModel,
} from './project.schema';

const OWNERS = ['example.saas-boilerplate'] as const;

/**
 * Create a new project.
 */
export const CreateProjectContract = defineCommand({
  meta: {
    key: 'saas.project.create',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'project', 'create'],
    description: 'Create a new project in the organization.',
    goal: 'Allow users to create projects for organizing work.',
    context: 'Called from project creation UI or API.',
  },
  io: {
    input: CreateProjectInputModel,
    output: ProjectModel,
    errors: {
      SLUG_EXISTS: {
        description: 'A project with this slug already exists',
        http: 409,
        gqlCode: 'SLUG_EXISTS',
        when: 'Slug is already taken in the organization',
      },
      LIMIT_REACHED: {
        description: 'Project limit reached for this plan',
        http: 403,
        gqlCode: 'LIMIT_REACHED',
        when: 'Organization has reached project limit',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        key: 'project.created',
        version: '1.0.0',
        when: 'Project is created',
        payload: ProjectModel,
      },
    ],
    audit: ['project.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-project-happy-path',
        given: ['User is authenticated'],
        when: ['User creates project'],
        then: ['Project is created', 'ProjectCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'create-basic',
        input: { name: 'Website Redesign', slug: 'website-redesign' },
        output: { id: 'proj-123', name: 'Website Redesign', isArchived: false },
      },
    ],
  },
});

/**
 * Get project by ID.
 */
export const GetProjectContract = defineQuery({
  meta: {
    key: 'saas.project.get',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'project', 'get'],
    description: 'Get a project by ID.',
    goal: 'Retrieve project details.',
    context: 'Project detail page, API calls.',
  },
  io: {
    input: GetProjectInputModel,
    output: ProjectModel,
    errors: {
      NOT_FOUND: {
        description: 'Project not found',
        http: 404,
        gqlCode: 'NOT_FOUND',
        when: 'Project ID is invalid or user lacks access',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  acceptance: {
    scenarios: [
      {
        key: 'get-project-happy-path',
        given: ['Project exists'],
        when: ['User requests project'],
        then: ['Project details are returned'],
      },
    ],
    examples: [
      {
        key: 'get-existing',
        input: { projectId: 'proj-123' },
        output: { id: 'proj-123', name: 'Website Redesign' },
      },
    ],
  },
});

/**
 * Update a project.
 */
export const UpdateProjectContract = defineCommand({
  meta: {
    key: 'saas.project.update',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'project', 'update'],
    description: 'Update project details.',
    goal: 'Allow project owners/editors to modify project.',
    context: 'Project settings page.',
  },
  io: {
    input: UpdateProjectInputModel,
    output: ProjectModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        key: 'project.updated',
        version: '1.0.0',
        when: 'Project is updated',
        payload: ProjectModel,
      },
    ],
    audit: ['project.updated'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'update-project-happy-path',
        given: ['Project exists'],
        when: ['User updates description'],
        then: ['Project is updated', 'ProjectUpdated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'update-desc',
        input: { projectId: 'proj-123', description: 'New description' },
        output: { id: 'proj-123', description: 'New description' },
      },
    ],
  },
});

/**
 * Delete a project.
 */
export const DeleteProjectContract = defineCommand({
  meta: {
    key: 'saas.project.delete',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'project', 'delete'],
    description: 'Delete a project (soft delete).',
    goal: 'Allow project owners to remove projects.',
    context: 'Project settings page.',
  },
  io: {
    input: DeleteProjectInputModel,
    output: DeleteProjectOutputModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        key: 'project.deleted',
        version: '1.0.0',
        when: 'Project is deleted',
        payload: ProjectDeletedPayloadModel,
      },
    ],
    audit: ['project.deleted'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'delete-project-happy-path',
        given: ['Project exists'],
        when: ['User deletes project'],
        then: ['Project is deleted', 'ProjectDeleted event is emitted'],
      },
    ],
    examples: [
      {
        key: 'delete-existing',
        input: { projectId: 'proj-123' },
        output: { success: true },
      },
    ],
  },
});

/**
 * List organization projects.
 */
export const ListProjectsContract = defineQuery({
  meta: {
    key: 'saas.project.list',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'project', 'list'],
    description: 'List projects in the organization.',
    goal: 'Show all projects user has access to.',
    context: 'Project list page, dashboard.',
  },
  io: {
    input: ListProjectsInputModel,
    output: ListProjectsOutputModel,
  },
  policy: {
    auth: 'user',
  },
  acceptance: {
    scenarios: [
      {
        key: 'list-projects-happy-path',
        given: ['Projects exist'],
        when: ['User lists projects'],
        then: ['List of projects is returned'],
      },
    ],
    examples: [
      {
        key: 'list-all',
        input: { limit: 10 },
        output: { items: [], total: 5 },
      },
    ],
  },
});

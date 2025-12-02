import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import {
  defineSchemaModel,
  ScalarTypeEnum,
  defineEnum,
} from '@lssm/lib.schema';

const OWNERS = ['example.saas-boilerplate'] as const;

// ============ Enums (for contract schemas) ============
// Note: Entity enums for Prisma are defined separately in ../entities

const ProjectStatusSchemaEnum = defineEnum('ProjectStatus', [
  'DRAFT',
  'ACTIVE',
  'ARCHIVED',
  'DELETED',
]);

export const ProjectStatusFilterEnum = defineEnum('ProjectStatusFilter', [
  'DRAFT',
  'ACTIVE',
  'ARCHIVED',
  'all',
]);

// ============ Schemas ============

export const ProjectModel = defineSchemaModel({
  name: 'Project',
  description: 'A project within an organization',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ProjectStatusSchemaEnum, isOptional: false },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: false,
    },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateProjectInputModel = defineSchemaModel({
  name: 'CreateProjectInput',
  description: 'Input for creating a project',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

export const UpdateProjectInputModel = defineSchemaModel({
  name: 'UpdateProjectInput',
  description: 'Input for updating a project',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    status: { type: ProjectStatusSchemaEnum, isOptional: true },
  },
});

export const GetProjectInputModel = defineSchemaModel({
  name: 'GetProjectInput',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const DeleteProjectInputModel = defineSchemaModel({
  name: 'DeleteProjectInput',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const DeleteProjectOutputModel = defineSchemaModel({
  name: 'DeleteProjectOutput',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const ProjectDeletedPayloadModel = defineSchemaModel({
  name: 'ProjectDeletedPayload',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListProjectsInputModel = defineSchemaModel({
  name: 'ListProjectsInput',
  description: 'Input for listing projects',
  fields: {
    status: { type: ProjectStatusFilterEnum, isOptional: true },
    search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 20,
    },
    offset: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 0,
    },
  },
});

export const ListProjectsOutputModel = defineSchemaModel({
  name: 'ListProjectsOutput',
  description: 'Output for listing projects',
  fields: {
    projects: { type: ProjectModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Create a new project.
 */
export const CreateProjectContract = defineCommand({
  meta: {
    name: 'saas.project.create',
    version: 1,
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
        name: 'project.created',
        version: 1,
        when: 'Project is created',
        payload: ProjectModel,
      },
    ],
    audit: ['project.created'],
  },
});

/**
 * Get project by ID.
 */
export const GetProjectContract = defineQuery({
  meta: {
    name: 'saas.project.get',
    version: 1,
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
});

/**
 * Update a project.
 */
export const UpdateProjectContract = defineCommand({
  meta: {
    name: 'saas.project.update',
    version: 1,
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
        name: 'project.updated',
        version: 1,
        when: 'Project is updated',
        payload: ProjectModel,
      },
    ],
    audit: ['project.updated'],
  },
});

/**
 * Delete a project.
 */
export const DeleteProjectContract = defineCommand({
  meta: {
    name: 'saas.project.delete',
    version: 1,
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
        name: 'project.deleted',
        version: 1,
        when: 'Project is deleted',
        payload: ProjectDeletedPayloadModel,
      },
    ],
    audit: ['project.deleted'],
  },
});

/**
 * List organization projects.
 */
export const ListProjectsContract = defineQuery({
  meta: {
    name: 'saas.project.list',
    version: 1,
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
});

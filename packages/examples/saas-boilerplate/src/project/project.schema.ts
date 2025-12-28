import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import {
  ProjectStatusSchemaEnum,
  ProjectStatusFilterEnum,
} from './project.enum';

/**
 * A project within an organization.
 */
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

/**
 * Input for creating a project.
 */
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

/**
 * Input for updating a project.
 */
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

/**
 * Input for getting a project.
 */
export const GetProjectInputModel = defineSchemaModel({
  name: 'GetProjectInput',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Input for deleting a project.
 */
export const DeleteProjectInputModel = defineSchemaModel({
  name: 'DeleteProjectInput',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Output for delete operation.
 */
export const DeleteProjectOutputModel = defineSchemaModel({
  name: 'DeleteProjectOutput',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

/**
 * Payload for project deleted event.
 */
export const ProjectDeletedPayloadModel = defineSchemaModel({
  name: 'ProjectDeletedPayload',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Input for listing projects.
 */
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

/**
 * Output for listing projects.
 */
export const ListProjectsOutputModel = defineSchemaModel({
  name: 'ListProjectsOutput',
  description: 'Output for listing projects',
  fields: {
    projects: { type: ProjectModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts-spec';

/**
 * Payload when a project is created.
 */
const ProjectCreatedPayload = defineSchemaModel({
  name: 'ProjectCreatedPayload',
  description: 'Payload when a project is created',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload when a project is updated.
 */
const ProjectUpdatedPayload = defineSchemaModel({
  name: 'ProjectUpdatedPayload',
  description: 'Payload when a project is updated',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedFields: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: false,
    },
    updatedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload when a project is deleted.
 */
const ProjectDeletedPayload = defineSchemaModel({
  name: 'ProjectDeletedPayload',
  description: 'Payload when a project is deleted',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    deletedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deletedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload when a project is archived.
 */
const ProjectArchivedPayload = defineSchemaModel({
  name: 'ProjectArchivedPayload',
  description: 'Payload when a project is archived',
  fields: {
    projectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    archivedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    archivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Event: A new project has been created.
 */
export const ProjectCreatedEvent = defineEvent({
  meta: {
    key: 'project.created',
    version: '1.0.0',
    description: 'A new project has been created.',
    stability: 'stable',
    owners: ['@saas-team'],
    tags: ['project', 'created'],
  },
  payload: ProjectCreatedPayload,
});

/**
 * Event: A project has been updated.
 */
export const ProjectUpdatedEvent = defineEvent({
  meta: {
    key: 'project.updated',
    version: '1.0.0',
    description: 'A project has been updated.',
    stability: 'stable',
    owners: ['@saas-team'],
    tags: ['project', 'updated'],
  },
  payload: ProjectUpdatedPayload,
});

/**
 * Event: A project has been deleted.
 */
export const ProjectDeletedEvent = defineEvent({
  meta: {
    key: 'project.deleted',
    version: '1.0.0',
    description: 'A project has been deleted.',
    stability: 'stable',
    owners: ['@saas-team'],
    tags: ['project', 'deleted'],
  },
  payload: ProjectDeletedPayload,
});

/**
 * Event: A project has been archived.
 */
export const ProjectArchivedEvent = defineEvent({
  meta: {
    key: 'project.archived',
    version: '1.0.0',
    description: 'A project has been archived.',
    stability: 'stable',
    owners: ['@saas-team'],
    tags: ['project', 'archived'],
  },
  payload: ProjectArchivedPayload,
});

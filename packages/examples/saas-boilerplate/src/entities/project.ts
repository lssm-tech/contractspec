import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Project status enum.
 */
export const ProjectStatusEnum = defineEntityEnum({
  name: 'ProjectStatus',
  values: ['DRAFT', 'ACTIVE', 'ARCHIVED', 'DELETED'] as const,
  schema: 'saas_app',
  description: 'Status of a project.',
});

/**
 * Project entity - team-scoped work container.
 */
export const ProjectEntity = defineEntity({
  name: 'Project',
  description: 'A project belonging to an organization.',
  schema: 'saas_app',
  map: 'project',
  fields: {
    id: field.id({ description: 'Unique project ID' }),
    name: field.string({ description: 'Project name' }),
    description: field.string({
      isOptional: true,
      description: 'Project description',
    }),
    slug: field.string({
      isOptional: true,
      description: 'URL-friendly identifier',
    }),

    // Ownership
    organizationId: field.foreignKey({ description: 'Owning organization' }),
    createdBy: field.foreignKey({
      description: 'User who created the project',
    }),

    // Status
    status: field.enum('ProjectStatus', { default: 'DRAFT' }),

    // Settings
    isPublic: field.boolean({
      default: false,
      description: 'Whether project is publicly visible',
    }),
    settings: field.json({
      isOptional: true,
      description: 'Project-specific settings',
    }),

    // Metadata
    tags: field.string({ isArray: true, description: 'Project tags' }),
    metadata: field.json({ isOptional: true }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    archivedAt: field.dateTime({ isOptional: true }),
  },
  indexes: [
    index.on(['organizationId', 'status']),
    index.on(['organizationId', 'createdAt']),
    index.unique(['organizationId', 'slug']),
  ],
  enums: [ProjectStatusEnum],
});

/**
 * ProjectMember entity - project-level access.
 */
export const ProjectMemberEntity = defineEntity({
  name: 'ProjectMember',
  description: 'User access to a specific project.',
  schema: 'saas_app',
  map: 'project_member',
  fields: {
    id: field.id(),
    projectId: field.foreignKey(),
    userId: field.foreignKey(),
    role: field.string({
      description: 'Role in project (owner, editor, viewer)',
    }),
    addedBy: field.string({ isOptional: true }),
    createdAt: field.createdAt(),
  },
  indexes: [index.unique(['projectId', 'userId'])],
});

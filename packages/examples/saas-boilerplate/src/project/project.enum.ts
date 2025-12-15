import { defineEnum } from '@lssm/lib.schema';

/**
 * Project status enum for contract schemas.
 * Note: Entity enum is defined separately in project.entity.ts
 */
export const ProjectStatusSchemaEnum = defineEnum('ProjectStatus', [
  'DRAFT',
  'ACTIVE',
  'ARCHIVED',
  'DELETED',
]);

/**
 * Project status filter enum (includes 'all' option).
 */
export const ProjectStatusFilterEnum = defineEnum('ProjectStatusFilter', [
  'DRAFT',
  'ACTIVE',
  'ARCHIVED',
  'all',
]);


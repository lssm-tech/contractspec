// User-related entities
export {
  UserEntity,
  SessionEntity,
  AccountEntity,
  VerificationEntity,
} from './user';

// Organization-related entities
export {
  OrganizationTypeEnum,
  OrganizationEntity,
  MemberEntity,
  InvitationEntity,
  TeamEntity,
  TeamMemberEntity,
} from './organization';

// RBAC entities
export {
  RoleEntity,
  PermissionEntity,
  PolicyBindingEntity,
  ApiKeyEntity,
  PasskeyEntity,
} from './rbac';

// Re-export all entities as a module contribution
import { UserEntity, SessionEntity, AccountEntity, VerificationEntity } from './user';
import {
  OrganizationTypeEnum,
  OrganizationEntity,
  MemberEntity,
  InvitationEntity,
  TeamEntity,
  TeamMemberEntity,
} from './organization';
import {
  RoleEntity,
  PermissionEntity,
  PolicyBindingEntity,
  ApiKeyEntity,
  PasskeyEntity,
} from './rbac';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

/**
 * All identity-rbac entities for schema composition.
 */
export const identityRbacEntities = [
  UserEntity,
  SessionEntity,
  AccountEntity,
  VerificationEntity,
  OrganizationEntity,
  MemberEntity,
  InvitationEntity,
  TeamEntity,
  TeamMemberEntity,
  RoleEntity,
  PermissionEntity,
  PolicyBindingEntity,
  ApiKeyEntity,
  PasskeyEntity,
];

/**
 * Module schema contribution for identity-rbac.
 */
export const identityRbacSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/lib.identity-rbac',
  entities: identityRbacEntities,
  enums: [OrganizationTypeEnum],
};


// User-related entities

// Organization-related entities
export {
	InvitationEntity,
	MemberEntity,
	OrganizationEntity,
	OrganizationTypeEnum,
	TeamEntity,
	TeamMemberEntity,
} from './organization';
// RBAC entities
export {
	ApiKeyEntity,
	PasskeyEntity,
	PermissionEntity,
	PolicyBindingEntity,
	RoleEntity,
} from './rbac';
export {
	AccountEntity,
	SessionEntity,
	UserEntity,
	VerificationEntity,
} from './user';

import type { ModuleSchemaContribution } from '@contractspec/lib.schema';
import {
	InvitationEntity,
	MemberEntity,
	OrganizationEntity,
	OrganizationTypeEnum,
	TeamEntity,
	TeamMemberEntity,
} from './organization';
import {
	ApiKeyEntity,
	PasskeyEntity,
	PermissionEntity,
	PolicyBindingEntity,
	RoleEntity,
} from './rbac';
// Re-export all entities as a module contribution
import {
	AccountEntity,
	SessionEntity,
	UserEntity,
	VerificationEntity,
} from './user';

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
	moduleId: '@contractspec/lib.identity-rbac',
	entities: identityRbacEntities,
	enums: [OrganizationTypeEnum],
};

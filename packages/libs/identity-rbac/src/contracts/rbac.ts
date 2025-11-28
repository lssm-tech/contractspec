import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';
import { SuccessResultModel } from './user';

const OWNERS = ['platform.identity-rbac'] as const;

// ============ SchemaModels ============

export const RoleModel = new SchemaModel({
  name: 'Role',
  description: 'RBAC role definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    permissions: { type: ScalarTypeEnum.String_unsecure(), isOptional: false, isArray: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const PolicyBindingModel = new SchemaModel({
  name: 'PolicyBinding',
  description: 'Role assignment to a target',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    roleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // user | organization
    targetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    role: { type: RoleModel, isOptional: false },
  },
});

export const PermissionCheckResultModel = new SchemaModel({
  name: 'PermissionCheckResult',
  description: 'Result of a permission check',
  fields: {
    allowed: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    matchedRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const CreateRoleInputModel = new SchemaModel({
  name: 'CreateRoleInput',
  description: 'Input for creating a role',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    permissions: { type: ScalarTypeEnum.String_unsecure(), isOptional: false, isArray: true },
  },
});

export const UpdateRoleInputModel = new SchemaModel({
  name: 'UpdateRoleInput',
  description: 'Input for updating a role',
  fields: {
    roleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    permissions: { type: ScalarTypeEnum.String_unsecure(), isOptional: true, isArray: true },
  },
});

export const DeleteRoleInputModel = new SchemaModel({
  name: 'DeleteRoleInput',
  description: 'Input for deleting a role',
  fields: {
    roleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListRolesOutputModel = new SchemaModel({
  name: 'ListRolesOutput',
  description: 'Output for listing roles',
  fields: {
    roles: { type: RoleModel, isOptional: false, isArray: true },
  },
});

export const AssignRoleInputModel = new SchemaModel({
  name: 'AssignRoleInput',
  description: 'Input for assigning a role',
  fields: {
    roleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // user | organization
    targetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const RevokeRoleInputModel = new SchemaModel({
  name: 'RevokeRoleInput',
  description: 'Input for revoking a role',
  fields: {
    bindingId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const BindingIdPayloadModel = new SchemaModel({
  name: 'BindingIdPayload',
  description: 'Payload with binding ID',
  fields: {
    bindingId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const CheckPermissionInputModel = new SchemaModel({
  name: 'CheckPermissionInput',
  description: 'Input for checking a permission',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    permission: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListUserPermissionsInputModel = new SchemaModel({
  name: 'ListUserPermissionsInput',
  description: 'Input for listing user permissions',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ListUserPermissionsOutputModel = new SchemaModel({
  name: 'ListUserPermissionsOutput',
  description: 'Output for listing user permissions',
  fields: {
    permissions: { type: ScalarTypeEnum.String_unsecure(), isOptional: false, isArray: true },
    roles: { type: RoleModel, isOptional: false, isArray: true },
  },
});

// ============ Contracts ============

/**
 * Create a new role.
 */
export const CreateRoleContract = defineCommand({
  meta: {
    name: 'identity.rbac.role.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'rbac', 'role', 'create'],
    description: 'Create a new role with permissions.',
    goal: 'Allow admins to define custom roles.',
    context: 'Role management in admin settings.',
  },
  io: {
    input: CreateRoleInputModel,
    output: RoleModel,
    errors: {
      ROLE_EXISTS: {
        description: 'A role with this name already exists',
        http: 409,
        gqlCode: 'ROLE_EXISTS',
        when: 'Role name is taken',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
  sideEffects: {
    audit: ['role.created'],
  },
});

/**
 * Update a role.
 */
export const UpdateRoleContract = defineCommand({
  meta: {
    name: 'identity.rbac.role.update',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'rbac', 'role', 'update'],
    description: 'Update an existing role.',
    goal: 'Allow admins to modify role permissions.',
    context: 'Role management in admin settings.',
  },
  io: {
    input: UpdateRoleInputModel,
    output: RoleModel,
  },
  policy: {
    auth: 'admin',
  },
  sideEffects: {
    audit: ['role.updated'],
  },
});

/**
 * Delete a role.
 */
export const DeleteRoleContract = defineCommand({
  meta: {
    name: 'identity.rbac.role.delete',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'rbac', 'role', 'delete'],
    description: 'Delete an existing role.',
    goal: 'Allow admins to remove unused roles.',
    context: 'Role management. Removes all policy bindings using this role.',
  },
  io: {
    input: DeleteRoleInputModel,
    output: SuccessResultModel,
    errors: {
      ROLE_IN_USE: {
        description: 'Role is still assigned to users or organizations',
        http: 409,
        gqlCode: 'ROLE_IN_USE',
        when: 'Role has active bindings',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
  sideEffects: {
    audit: ['role.deleted'],
  },
});

/**
 * List all roles.
 */
export const ListRolesContract = defineQuery({
  meta: {
    name: 'identity.rbac.role.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'rbac', 'role', 'list'],
    description: 'List all available roles.',
    goal: 'Show available roles for assignment.',
    context: 'Role assignment UI.',
  },
  io: {
    input: null,
    output: ListRolesOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Assign a role to a user or organization.
 */
export const AssignRoleContract = defineCommand({
  meta: {
    name: 'identity.rbac.assign',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'rbac', 'assign'],
    description: 'Assign a role to a user or organization.',
    goal: 'Grant permissions via role assignment.',
    context: 'User/org permission management.',
  },
  io: {
    input: AssignRoleInputModel,
    output: PolicyBindingModel,
    errors: {
      ROLE_NOT_FOUND: {
        description: 'The specified role does not exist',
        http: 404,
        gqlCode: 'ROLE_NOT_FOUND',
        when: 'Role ID is invalid',
      },
      ALREADY_ASSIGNED: {
        description: 'This role is already assigned to the target',
        http: 409,
        gqlCode: 'ALREADY_ASSIGNED',
        when: 'Binding already exists',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
  sideEffects: {
    emits: [{ name: 'role.assigned', version: 1, when: 'Role is assigned', payload: PolicyBindingModel }],
    audit: ['role.assigned'],
  },
});

/**
 * Revoke a role from a user or organization.
 */
export const RevokeRoleContract = defineCommand({
  meta: {
    name: 'identity.rbac.revoke',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'rbac', 'revoke'],
    description: 'Revoke a role from a user or organization.',
    goal: 'Remove permissions via role revocation.',
    context: 'User/org permission management.',
  },
  io: {
    input: RevokeRoleInputModel,
    output: SuccessResultModel,
    errors: {
      BINDING_NOT_FOUND: {
        description: 'The policy binding does not exist',
        http: 404,
        gqlCode: 'BINDING_NOT_FOUND',
        when: 'Binding ID is invalid',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
  sideEffects: {
    emits: [{ name: 'role.revoked', version: 1, when: 'Role is revoked', payload: BindingIdPayloadModel }],
    audit: ['role.revoked'],
  },
});

/**
 * Check if a user has a specific permission.
 */
export const CheckPermissionContract = defineQuery({
  meta: {
    name: 'identity.rbac.check',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'rbac', 'check', 'permission'],
    description: 'Check if a user has a specific permission.',
    goal: 'Authorization check before sensitive operations.',
    context: 'Called by other services to verify permissions.',
  },
  io: {
    input: CheckPermissionInputModel,
    output: PermissionCheckResultModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * List permissions for a user.
 */
export const ListUserPermissionsContract = defineQuery({
  meta: {
    name: 'identity.rbac.permissions',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'rbac', 'permissions', 'user'],
    description: 'List all permissions for a user in a context.',
    goal: 'Show what a user can do in an org.',
    context: 'UI permission display, debugging.',
  },
  io: {
    input: ListUserPermissionsInputModel,
    output: ListUserPermissionsOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

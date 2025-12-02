import { z } from 'zod';

/**
 * Standard permissions for identity-rbac module.
 */
export const Permission = {
  // User permissions
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_LIST: 'user.list',
  USER_MANAGE: 'user.manage',

  // Organization permissions
  ORG_CREATE: 'org.create',
  ORG_READ: 'org.read',
  ORG_UPDATE: 'org.update',
  ORG_DELETE: 'org.delete',
  ORG_LIST: 'org.list',

  // Member permissions
  MEMBER_INVITE: 'member.invite',
  MEMBER_REMOVE: 'member.remove',
  MEMBER_UPDATE_ROLE: 'member.update_role',
  MEMBER_LIST: 'member.list',
  MANAGE_MEMBERS: 'org.manage_members',

  // Team permissions
  TEAM_CREATE: 'team.create',
  TEAM_UPDATE: 'team.update',
  TEAM_DELETE: 'team.delete',
  TEAM_MANAGE: 'team.manage',

  // Role permissions
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_ASSIGN: 'role.assign',
  ROLE_REVOKE: 'role.revoke',

  // Billing permissions
  BILLING_VIEW: 'billing.view',
  BILLING_MANAGE: 'billing.manage',

  // Project permissions
  PROJECT_CREATE: 'project.create',
  PROJECT_READ: 'project.read',
  PROJECT_UPDATE: 'project.update',
  PROJECT_DELETE: 'project.delete',
  PROJECT_MANAGE: 'project.manage',

  // Admin permissions
  ADMIN_ACCESS: 'admin.access',
  ADMIN_IMPERSONATE: 'admin.impersonate',
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

/**
 * Standard role definitions.
 */
export const StandardRole = {
  OWNER: {
    name: 'owner',
    description: 'Organization owner with full access',
    permissions: Object.values(Permission),
  },
  ADMIN: {
    name: 'admin',
    description: 'Administrator with most permissions',
    permissions: [
      Permission.USER_READ,
      Permission.USER_LIST,
      Permission.ORG_READ,
      Permission.ORG_UPDATE,
      Permission.MEMBER_INVITE,
      Permission.MEMBER_REMOVE,
      Permission.MEMBER_UPDATE_ROLE,
      Permission.MEMBER_LIST,
      Permission.MANAGE_MEMBERS,
      Permission.TEAM_CREATE,
      Permission.TEAM_UPDATE,
      Permission.TEAM_DELETE,
      Permission.TEAM_MANAGE,
      Permission.PROJECT_CREATE,
      Permission.PROJECT_READ,
      Permission.PROJECT_UPDATE,
      Permission.PROJECT_DELETE,
      Permission.PROJECT_MANAGE,
      Permission.BILLING_VIEW,
    ],
  },
  MEMBER: {
    name: 'member',
    description: 'Regular organization member',
    permissions: [
      Permission.USER_READ,
      Permission.ORG_READ,
      Permission.MEMBER_LIST,
      Permission.PROJECT_READ,
      Permission.PROJECT_CREATE,
    ],
  },
  VIEWER: {
    name: 'viewer',
    description: 'Read-only access',
    permissions: [
      Permission.USER_READ,
      Permission.ORG_READ,
      Permission.MEMBER_LIST,
      Permission.PROJECT_READ,
    ],
  },
} as const;

/**
 * Permission check input.
 */
export interface PermissionCheckInput {
  userId: string;
  orgId?: string;
  permission: PermissionKey | string;
}

/**
 * Permission check result.
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  matchedRole?: string;
}

/**
 * Role with permissions.
 */
export interface RoleWithPermissions {
  id: string;
  name: string;
  permissions: string[];
}

/**
 * Policy binding for permission evaluation.
 */
export interface PolicyBindingForEval {
  roleId: string;
  role: RoleWithPermissions;
  targetType: 'user' | 'organization';
  targetId: string;
  expiresAt?: Date | null;
}

/**
 * RBAC Policy Engine for permission checks.
 */
export class RBACPolicyEngine {
  private roleCache = new Map<string, RoleWithPermissions>();
  private bindingCache = new Map<string, PolicyBindingForEval[]>();

  /**
   * Check if a user has a specific permission.
   */
  async checkPermission(
    input: PermissionCheckInput,
    bindings: PolicyBindingForEval[]
  ): Promise<PermissionCheckResult> {
    const { userId, orgId, permission } = input;
    const now = new Date();

    // Get all applicable bindings
    const userBindings = bindings.filter(
      (b) => b.targetType === 'user' && b.targetId === userId
    );

    const orgBindings = orgId
      ? bindings.filter(
          (b) => b.targetType === 'organization' && b.targetId === orgId
        )
      : [];

    const allBindings = [...userBindings, ...orgBindings];

    // Filter out expired bindings
    const activeBindings = allBindings.filter(
      (b) => !b.expiresAt || b.expiresAt > now
    );

    if (activeBindings.length === 0) {
      return {
        allowed: false,
        reason: 'No active role bindings found',
      };
    }

    // Check if any role grants the permission
    for (const binding of activeBindings) {
      if (binding.role.permissions.includes(permission)) {
        return {
          allowed: true,
          matchedRole: binding.role.name,
        };
      }
    }

    return {
      allowed: false,
      reason: `No role grants the "${permission}" permission`,
    };
  }

  /**
   * Get all permissions for a user in a context.
   */
  async getPermissions(
    userId: string,
    orgId: string | undefined,
    bindings: PolicyBindingForEval[]
  ): Promise<{
    permissions: Set<string>;
    roles: RoleWithPermissions[];
  }> {
    const now = new Date();

    // Get all applicable bindings
    const userBindings = bindings.filter(
      (b) => b.targetType === 'user' && b.targetId === userId
    );

    const orgBindings = orgId
      ? bindings.filter(
          (b) => b.targetType === 'organization' && b.targetId === orgId
        )
      : [];

    const allBindings = [...userBindings, ...orgBindings];

    // Filter out expired bindings
    const activeBindings = allBindings.filter(
      (b) => !b.expiresAt || b.expiresAt > now
    );

    const permissions = new Set<string>();
    const roles: RoleWithPermissions[] = [];

    for (const binding of activeBindings) {
      roles.push(binding.role);
      for (const perm of binding.role.permissions) {
        permissions.add(perm);
      }
    }

    return { permissions, roles };
  }

  /**
   * Check if user has any of the specified permissions.
   */
  async hasAnyPermission(
    userId: string,
    orgId: string | undefined,
    permissions: string[],
    bindings: PolicyBindingForEval[]
  ): Promise<boolean> {
    const { permissions: userPerms } = await this.getPermissions(
      userId,
      orgId,
      bindings
    );

    return permissions.some((p) => userPerms.has(p));
  }

  /**
   * Check if user has all of the specified permissions.
   */
  async hasAllPermissions(
    userId: string,
    orgId: string | undefined,
    permissions: string[],
    bindings: PolicyBindingForEval[]
  ): Promise<boolean> {
    const { permissions: userPerms } = await this.getPermissions(
      userId,
      orgId,
      bindings
    );

    return permissions.every((p) => userPerms.has(p));
  }
}

/**
 * Create a new RBAC policy engine instance.
 */
export function createRBACEngine(): RBACPolicyEngine {
  return new RBACPolicyEngine();
}

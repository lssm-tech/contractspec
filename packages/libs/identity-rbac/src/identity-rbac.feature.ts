/**
 * Identity RBAC Feature Module Specification
 *
 * Defines the feature module for identity management and role-based access control.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Identity RBAC feature module that bundles user, organization,
 * and role-based access control capabilities.
 */
export const IdentityRbacFeature: FeatureModuleSpec = {
  meta: {
    key: 'identity-rbac',
    title: 'Identity & RBAC',
    description:
      'User identity, organization management, and role-based access control',
    domain: 'platform',
    owners: ['@platform.identity-rbac'],
    tags: ['identity', 'rbac', 'users', 'organizations', 'permissions'],
    stability: 'stable',
  },

  // All contract operations included in this feature
  operations: [
    // User operations
    { name: 'identity.user.create', version: 1 },
    { name: 'identity.user.update', version: 1 },
    { name: 'identity.user.delete', version: 1 },
    { name: 'identity.user.me', version: 1 },
    { name: 'identity.user.list', version: 1 },

    // Organization operations
    { name: 'identity.org.create', version: 1 },
    { name: 'identity.org.update', version: 1 },
    { name: 'identity.org.get', version: 1 },
    { name: 'identity.org.list', version: 1 },
    { name: 'identity.org.invite', version: 1 },
    { name: 'identity.org.invite.accept', version: 1 },
    { name: 'identity.org.member.remove', version: 1 },
    { name: 'identity.org.members.list', version: 1 },

    // RBAC operations
    { name: 'identity.rbac.role.create', version: 1 },
    { name: 'identity.rbac.role.update', version: 1 },
    { name: 'identity.rbac.role.delete', version: 1 },
    { name: 'identity.rbac.role.list', version: 1 },
    { name: 'identity.rbac.assign', version: 1 },
    { name: 'identity.rbac.revoke', version: 1 },
    { name: 'identity.rbac.check', version: 1 },
    { name: 'identity.rbac.permissions', version: 1 },
  ],

  // Events emitted by this feature
  events: [
    // User events
    { name: 'user.created', version: 1 },
    { name: 'user.updated', version: 1 },
    { name: 'user.deleted', version: 1 },
    { name: 'user.email_verified', version: 1 },

    // Organization events
    { name: 'org.created', version: 1 },
    { name: 'org.updated', version: 1 },
    { name: 'org.deleted', version: 1 },
    { name: 'org.member.added', version: 1 },
    { name: 'org.member.removed', version: 1 },
    { name: 'org.member.role_changed', version: 1 },

    // Invitation events
    { name: 'org.invite.sent', version: 1 },
    { name: 'org.invite.accepted', version: 1 },
    { name: 'org.invite.declined', version: 1 },

    // Role events
    { name: 'role.assigned', version: 1 },
    { name: 'role.revoked', version: 1 },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'identity', version: 1 },
      { key: 'rbac', version: 1 },
    ],
    requires: [],
  },
};

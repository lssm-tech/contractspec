/**
 * Identity RBAC Feature Module Specification
 *
 * Defines the feature module for identity management and role-based access control.
 */
import { defineFeature } from '@contractspec/lib.contracts';

/**
 * Identity & RBAC feature module that bundles user management,
 * organization tenancy, and role-based access control.
 */
export const IdentityRbacFeature = defineFeature({
  meta: {
    key: 'identity-rbac',
    version: '1.0.0',
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
    { key: 'identity.user.create', version: '1.0.0' },
    { key: 'identity.user.update', version: '1.0.0' },
    { key: 'identity.user.delete', version: '1.0.0' },
    { key: 'identity.user.me', version: '1.0.0' },
    { key: 'identity.user.list', version: '1.0.0' },

    // Organization operations
    { key: 'identity.org.create', version: '1.0.0' },
    { key: 'identity.org.update', version: '1.0.0' },
    { key: 'identity.org.get', version: '1.0.0' },
    { key: 'identity.org.list', version: '1.0.0' },
    { key: 'identity.org.invite', version: '1.0.0' },
    { key: 'identity.org.invite.accept', version: '1.0.0' },
    { key: 'identity.org.member.remove', version: '1.0.0' },
    { key: 'identity.org.members.list', version: '1.0.0' },

    // RBAC operations
    { key: 'identity.rbac.role.create', version: '1.0.0' },
    { key: 'identity.rbac.role.update', version: '1.0.0' },
    { key: 'identity.rbac.role.delete', version: '1.0.0' },
    { key: 'identity.rbac.role.list', version: '1.0.0' },
    { key: 'identity.rbac.assign', version: '1.0.0' },
    { key: 'identity.rbac.revoke', version: '1.0.0' },
    { key: 'identity.rbac.check', version: '1.0.0' },
    { key: 'identity.rbac.permissions', version: '1.0.0' },
  ],

  // Events emitted by this feature
  events: [
    // User events
    { key: 'user.created', version: '1.0.0' },
    { key: 'user.updated', version: '1.0.0' },
    { key: 'user.deleted', version: '1.0.0' },
    { key: 'user.email_verified', version: '1.0.0' },

    // Organization events
    { key: 'org.created', version: '1.0.0' },
    { key: 'org.updated', version: '1.0.0' },
    { key: 'org.deleted', version: '1.0.0' },
    { key: 'org.member.added', version: '1.0.0' },
    { key: 'org.member.removed', version: '1.0.0' },
    { key: 'org.member.role_changed', version: '1.0.0' },

    // Invitation events
    { key: 'org.invite.sent', version: '1.0.0' },
    { key: 'org.invite.accepted', version: '1.0.0' },
    { key: 'org.invite.declined', version: '1.0.0' },

    // Role events
    { key: 'role.assigned', version: '1.0.0' },
    { key: 'role.revoked', version: '1.0.0' },
  ],

  // No presentations for this library feature
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [
      { key: 'identity', version: '1.0.0' },
      { key: 'rbac', version: '1.0.0' },
    ],
    requires: [],
  },
});

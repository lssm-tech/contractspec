import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts';

// ============ User Event Payloads ============

const UserCreatedPayload = new SchemaModel({
  name: 'UserCreatedPayload',
  description: 'Payload for user created event',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UserUpdatedPayload = new SchemaModel({
  name: 'UserUpdatedPayload',
  description: 'Payload for user updated event',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedFields: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UserDeletedPayload = new SchemaModel({
  name: 'UserDeletedPayload',
  description: 'Payload for user deleted event',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    deletedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UserEmailVerifiedPayload = new SchemaModel({
  name: 'UserEmailVerifiedPayload',
  description: 'Payload for user email verified event',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    verifiedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Organization Event Payloads ============

const OrgCreatedPayload = new SchemaModel({
  name: 'OrgCreatedPayload',
  description: 'Payload for org created event',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrgUpdatedPayload = new SchemaModel({
  name: 'OrgUpdatedPayload',
  description: 'Payload for org updated event',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedFields: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
    updatedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrgDeletedPayload = new SchemaModel({
  name: 'OrgDeletedPayload',
  description: 'Payload for org deleted event',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deletedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deletedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Member Event Payloads ============

const OrgMemberAddedPayload = new SchemaModel({
  name: 'OrgMemberAddedPayload',
  description: 'Payload for member added event',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    invitedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    joinedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrgMemberRemovedPayload = new SchemaModel({
  name: 'OrgMemberRemovedPayload',
  description: 'Payload for member removed event',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    removedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true }, // left | removed | banned
    removedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrgMemberRoleChangedPayload = new SchemaModel({
  name: 'OrgMemberRoleChangedPayload',
  description: 'Payload for member role changed event',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    newRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Invitation Event Payloads ============

const OrgInviteSentPayload = new SchemaModel({
  name: 'OrgInviteSentPayload',
  description: 'Payload for invite sent event',
  fields: {
    invitationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    invitedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    sentAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrgInviteAcceptedPayload = new SchemaModel({
  name: 'OrgInviteAcceptedPayload',
  description: 'Payload for invite accepted event',
  fields: {
    invitationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    acceptedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrgInviteDeclinedPayload = new SchemaModel({
  name: 'OrgInviteDeclinedPayload',
  description: 'Payload for invite declined event',
  fields: {
    invitationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    declinedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Role Event Payloads ============

const RoleAssignedPayload = new SchemaModel({
  name: 'RoleAssignedPayload',
  description: 'Payload for role assigned event',
  fields: {
    bindingId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    roleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    roleName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // user | organization
    targetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    assignedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    assignedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const RoleRevokedPayload = new SchemaModel({
  name: 'RoleRevokedPayload',
  description: 'Payload for role revoked event',
  fields: {
    bindingId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    roleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    roleName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // user | organization
    targetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    revokedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    revokedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ User Events ============

/**
 * Emitted when a new user is created.
 */
export const UserCreatedEvent = defineEvent({
  meta: {
    key: 'user.created',
    version: '1.0.0',
    description: 'A new user has been created.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['user', 'created', 'identity'],
  },
  payload: UserCreatedPayload,
});

/**
 * Emitted when a user profile is updated.
 */
export const UserUpdatedEvent = defineEvent({
  meta: {
    key: 'user.updated',
    version: '1.0.0',
    description: 'A user profile has been updated.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['user', 'updated', 'identity'],
  },
  payload: UserUpdatedPayload,
});

/**
 * Emitted when a user is deleted.
 */
export const UserDeletedEvent = defineEvent({
  meta: {
    key: 'user.deleted',
    version: '1.0.0',
    description: 'A user account has been deleted.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['user', 'deleted', 'identity'],
  },
  pii: ['email'],
  payload: UserDeletedPayload,
});

/**
 * Emitted when a user's email is verified.
 */
export const UserEmailVerifiedEvent = defineEvent({
  meta: {
    key: 'user.email_verified',
    version: '1.0.0',
    description: 'A user has verified their email address.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['user', 'verified', 'identity'],
  },
  payload: UserEmailVerifiedPayload,
});

// ============ Organization Events ============

/**
 * Emitted when a new organization is created.
 */
export const OrgCreatedEvent = defineEvent({
  meta: {
    key: 'org.created',
    version: '1.0.0',
    description: 'A new organization has been created.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'created', 'identity'],
  },
  payload: OrgCreatedPayload,
});

/**
 * Emitted when an organization is updated.
 */
export const OrgUpdatedEvent = defineEvent({
  meta: {
    key: 'org.updated',
    version: '1.0.0',
    description: 'An organization has been updated.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'updated', 'identity'],
  },
  payload: OrgUpdatedPayload,
});

/**
 * Emitted when an organization is deleted.
 */
export const OrgDeletedEvent = defineEvent({
  meta: {
    key: 'org.deleted',
    version: '1.0.0',
    description: 'An organization has been deleted.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'deleted', 'identity'],
  },
  payload: OrgDeletedPayload,
});

// ============ Member Events ============

/**
 * Emitted when a member joins an organization.
 */
export const OrgMemberAddedEvent = defineEvent({
  meta: {
    key: 'org.member.added',
    version: '1.0.0',
    description: 'A user has joined an organization.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'member', 'added', 'identity'],
  },
  payload: OrgMemberAddedPayload,
});

/**
 * Emitted when a member leaves or is removed from an organization.
 */
export const OrgMemberRemovedEvent = defineEvent({
  meta: {
    key: 'org.member.removed',
    version: '1.0.0',
    description: 'A user has left or been removed from an organization.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'member', 'removed', 'identity'],
  },
  payload: OrgMemberRemovedPayload,
});

/**
 * Emitted when a member's role is changed.
 */
export const OrgMemberRoleChangedEvent = defineEvent({
  meta: {
    key: 'org.member.role_changed',
    version: '1.0.0',
    description: "A member's role in an organization has changed.",
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'member', 'role', 'changed', 'identity'],
  },
  payload: OrgMemberRoleChangedPayload,
});

// ============ Invitation Events ============

/**
 * Emitted when an invitation is sent.
 */
export const OrgInviteSentEvent = defineEvent({
  meta: {
    key: 'org.invite.sent',
    version: '1.0.0',
    description: 'An invitation to join an organization has been sent.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'invite', 'sent', 'identity'],
  },
  pii: ['email'],
  payload: OrgInviteSentPayload,
});

/**
 * Emitted when an invitation is accepted.
 */
export const OrgInviteAcceptedEvent = defineEvent({
  meta: {
    key: 'org.invite.accepted',
    version: '1.0.0',
    description: 'An invitation has been accepted.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'invite', 'accepted', 'identity'],
  },
  payload: OrgInviteAcceptedPayload,
});

/**
 * Emitted when an invitation is declined.
 */
export const OrgInviteDeclinedEvent = defineEvent({
  meta: {
    key: 'org.invite.declined',
    version: '1.0.0',
    description: 'An invitation has been declined.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['org', 'invite', 'declined', 'identity'],
  },
  payload: OrgInviteDeclinedPayload,
});

// ============ Role Events ============

/**
 * Emitted when a role is assigned to a user or organization.
 */
export const RoleAssignedEvent = defineEvent({
  meta: {
    key: 'role.assigned',
    version: '1.0.0',
    description: 'A role has been assigned.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['role', 'assigned', 'identity'],
  },
  payload: RoleAssignedPayload,
});

/**
 * Emitted when a role is revoked from a user or organization.
 */
export const RoleRevokedEvent = defineEvent({
  meta: {
    key: 'role.revoked',
    version: '1.0.0',
    description: 'A role has been revoked.',
    stability: 'stable',
    owners: ['@platform.identity-rbac'],
    tags: ['role', 'revoked', 'identity'],
  },
  payload: RoleRevokedPayload,
});

// ============ All Events ============

/**
 * All identity-rbac events.
 */
export const IdentityRbacEvents = {
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
  UserEmailVerifiedEvent,
  OrgCreatedEvent,
  OrgUpdatedEvent,
  OrgDeletedEvent,
  OrgMemberAddedEvent,
  OrgMemberRemovedEvent,
  OrgMemberRoleChangedEvent,
  OrgInviteSentEvent,
  OrgInviteAcceptedEvent,
  OrgInviteDeclinedEvent,
  RoleAssignedEvent,
  RoleRevokedEvent,
};

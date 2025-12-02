import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';
import { UserProfileModel, SuccessResultModel } from './user';

const OWNERS = ['platform.identity-rbac'] as const;

// ============ SchemaModels ============

export const OrganizationModel = new SchemaModel({
  name: 'Organization',
  description: 'Organization details',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    logo: { type: ScalarTypeEnum.URL(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // PLATFORM_ADMIN | CONTRACT_SPEC_CUSTOMER
    onboardingCompleted: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const MemberUserModel = new SchemaModel({
  name: 'MemberUser',
  description: 'Basic user info within a member',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const MemberModel = new SchemaModel({
  name: 'Member',
  description: 'Organization member',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    user: { type: MemberUserModel, isOptional: false },
  },
});

export const InvitationModel = new SchemaModel({
  name: 'Invitation',
  description: 'Organization invitation',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // pending | accepted | declined | expired
    expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateOrgInputModel = new SchemaModel({
  name: 'CreateOrgInput',
  description: 'Input for creating an organization',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const GetOrgInputModel = new SchemaModel({
  name: 'GetOrgInput',
  description: 'Input for getting an organization',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const UpdateOrgInputModel = new SchemaModel({
  name: 'UpdateOrgInput',
  description: 'Input for updating an organization',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    logo: { type: ScalarTypeEnum.URL(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const InviteMemberInputModel = new SchemaModel({
  name: 'InviteMemberInput',
  description: 'Input for inviting a member',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // owner | admin | member
    teamId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const AcceptInviteInputModel = new SchemaModel({
  name: 'AcceptInviteInput',
  description: 'Input for accepting an invitation',
  fields: {
    invitationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const RemoveMemberInputModel = new SchemaModel({
  name: 'RemoveMemberInput',
  description: 'Input for removing a member',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const MemberRemovedPayloadModel = new SchemaModel({
  name: 'MemberRemovedPayload',
  description: 'Payload for member removed event',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListMembersInputModel = new SchemaModel({
  name: 'ListMembersInput',
  description: 'Input for listing members',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const ListMembersOutputModel = new SchemaModel({
  name: 'ListMembersOutput',
  description: 'Output for listing members',
  fields: {
    members: { type: MemberModel, isOptional: false, isArray: true },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const OrganizationWithRoleModel = new SchemaModel({
  name: 'OrganizationWithRole',
  description: 'Organization with user role',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    logo: { type: ScalarTypeEnum.URL(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    onboardingCompleted: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListUserOrgsOutputModel = new SchemaModel({
  name: 'ListUserOrgsOutput',
  description: 'Output for listing user organizations',
  fields: {
    organizations: {
      type: OrganizationWithRoleModel,
      isOptional: false,
      isArray: true,
    },
  },
});

// ============ Contracts ============

/**
 * Create a new organization.
 */
export const CreateOrgContract = defineCommand({
  meta: {
    name: 'identity.org.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'org', 'create'],
    description: 'Create a new organization.',
    goal: 'Allow users to create new organizations/workspaces.',
    context: 'Called during onboarding or when creating additional workspaces.',
  },
  io: {
    input: CreateOrgInputModel,
    output: OrganizationModel,
    errors: {
      SLUG_EXISTS: {
        description: 'An organization with this slug already exists',
        http: 409,
        gqlCode: 'SLUG_EXISTS',
        when: 'Slug is already taken',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'org.created',
        version: 1,
        when: 'Organization is created',
        payload: OrganizationModel,
      },
    ],
    audit: ['org.created'],
  },
});

/**
 * Get organization details.
 */
export const GetOrgContract = defineQuery({
  meta: {
    name: 'identity.org.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'org', 'get'],
    description: 'Get organization details.',
    goal: 'Retrieve organization information.',
    context: 'Called when viewing organization settings or dashboard.',
  },
  io: {
    input: GetOrgInputModel,
    output: OrganizationModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Update organization.
 */
export const UpdateOrgContract = defineCommand({
  meta: {
    name: 'identity.org.update',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'org', 'update'],
    description: 'Update organization details.',
    goal: 'Allow org admins to update organization settings.',
    context: 'Organization settings page.',
  },
  io: {
    input: UpdateOrgInputModel,
    output: OrganizationModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'org.updated',
        version: 1,
        when: 'Organization is updated',
        payload: OrganizationModel,
      },
    ],
    audit: ['org.updated'],
  },
});

/**
 * Invite a member to the organization.
 */
export const InviteMemberContract = defineCommand({
  meta: {
    name: 'identity.org.invite',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'org', 'invite', 'member'],
    description: 'Invite a user to join the organization.',
    goal: 'Allow org admins to invite new members.',
    context: 'Team management. Sends invitation email.',
  },
  io: {
    input: InviteMemberInputModel,
    output: InvitationModel,
    errors: {
      ALREADY_MEMBER: {
        description: 'User is already a member of this organization',
        http: 409,
        gqlCode: 'ALREADY_MEMBER',
        when: 'Invitee is already a member',
      },
      INVITE_PENDING: {
        description: 'An invitation for this email is already pending',
        http: 409,
        gqlCode: 'INVITE_PENDING',
        when: 'Active invitation exists',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'org.invite.sent',
        version: 1,
        when: 'Invitation is sent',
        payload: InvitationModel,
      },
    ],
    audit: ['org.invite.sent'],
  },
});

/**
 * Accept an invitation.
 */
export const AcceptInviteContract = defineCommand({
  meta: {
    name: 'identity.org.invite.accept',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'org', 'invite', 'accept'],
    description: 'Accept an organization invitation.',
    goal: 'Allow users to join organizations via invitation.',
    context: 'Called from invitation email link.',
  },
  io: {
    input: AcceptInviteInputModel,
    output: MemberModel,
    errors: {
      INVITE_EXPIRED: {
        description: 'The invitation has expired',
        http: 410,
        gqlCode: 'INVITE_EXPIRED',
        when: 'Invitation is past expiry date',
      },
      INVITE_USED: {
        description: 'The invitation has already been used',
        http: 409,
        gqlCode: 'INVITE_USED',
        when: 'Invitation was already accepted',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'org.member.added',
        version: 1,
        when: 'Member joins org',
        payload: MemberModel,
      },
    ],
    audit: ['org.member.added'],
  },
});

/**
 * Remove a member from the organization.
 */
export const RemoveMemberContract = defineCommand({
  meta: {
    name: 'identity.org.member.remove',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'org', 'member', 'remove'],
    description: 'Remove a member from the organization.',
    goal: 'Allow org admins to remove members.',
    context: 'Team management.',
  },
  io: {
    input: RemoveMemberInputModel,
    output: SuccessResultModel,
    errors: {
      CANNOT_REMOVE_OWNER: {
        description: 'Cannot remove the organization owner',
        http: 403,
        gqlCode: 'CANNOT_REMOVE_OWNER',
        when: 'Target is the org owner',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'org.member.removed',
        version: 1,
        when: 'Member is removed',
        payload: MemberRemovedPayloadModel,
      },
    ],
    audit: ['org.member.removed'],
  },
});

/**
 * List organization members.
 */
export const ListMembersContract = defineQuery({
  meta: {
    name: 'identity.org.members.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'org', 'member', 'list'],
    description: 'List organization members.',
    goal: 'View all members of an organization.',
    context: 'Team management page.',
  },
  io: {
    input: ListMembersInputModel,
    output: ListMembersOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * List user's organizations.
 */
export const ListUserOrgsContract = defineQuery({
  meta: {
    name: 'identity.org.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'org', 'list'],
    description: 'List organizations the current user belongs to.',
    goal: 'Show user their organizations for workspace switching.',
    context: 'Workspace switcher, org selection.',
  },
  io: {
    input: null,
    output: ListUserOrgsOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Organization type enum.
 */
export const OrganizationTypeEnum = defineEntityEnum({
  name: 'OrganizationType',
  values: ['PLATFORM_ADMIN', 'CONTRACT_SPEC_CUSTOMER'] as const,
  schema: 'lssm_sigil',
  description: 'Type of organization in the platform.',
});

/**
 * Organization entity - tenant/company grouping.
 */
export const OrganizationEntity = defineEntity({
  name: 'Organization',
  description: 'An organization is a tenant boundary grouping users.',
  schema: 'lssm_sigil',
  map: 'organization',
  fields: {
    id: field.id({ description: 'Unique organization identifier' }),
    name: field.string({ description: 'Organization display name' }),
    slug: field.string({
      isOptional: true,
      isUnique: true,
      description: 'URL-friendly identifier',
    }),
    logo: field.url({ isOptional: true, description: 'Organization logo URL' }),
    description: field.string({
      isOptional: true,
      description: 'Organization description',
    }),
    metadata: field.json({
      isOptional: true,
      description: 'Arbitrary organization metadata',
    }),
    type: field.enum('OrganizationType', { description: 'Organization type' }),

    // Onboarding
    onboardingCompleted: field.boolean({ default: false }),
    onboardingStep: field.string({ isOptional: true }),

    // Referrals
    referralCode: field.string({
      isOptional: true,
      isUnique: true,
      description: 'Unique referral code',
    }),
    referredBy: field.string({
      isOptional: true,
      description: 'ID of referring user',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    members: field.hasMany('Member'),
    invitations: field.hasMany('Invitation'),
    teams: field.hasMany('Team'),
    policyBindings: field.hasMany('PolicyBinding'),
  },
  enums: [OrganizationTypeEnum],
});

/**
 * Member entity - user membership in an organization.
 */
export const MemberEntity = defineEntity({
  name: 'Member',
  description: 'Membership of a user in an organization with a role.',
  schema: 'lssm_sigil',
  map: 'member',
  fields: {
    id: field.id(),
    userId: field.foreignKey(),
    organizationId: field.foreignKey(),
    role: field.string({
      description: 'Role in organization (owner, admin, member)',
    }),
    createdAt: field.createdAt(),

    // Relations
    user: field.belongsTo('User', ['userId'], ['id'], { onDelete: 'Cascade' }),
    organization: field.belongsTo('Organization', ['organizationId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.unique(['userId', 'organizationId'])],
});

/**
 * Invitation entity - pending organization invites.
 */
export const InvitationEntity = defineEntity({
  name: 'Invitation',
  description: 'An invitation to join an organization.',
  schema: 'lssm_sigil',
  map: 'invitation',
  fields: {
    id: field.id(),
    organizationId: field.foreignKey(),
    email: field.email({ description: 'Invited email address' }),
    role: field.string({
      isOptional: true,
      description: 'Role to assign on acceptance',
    }),
    status: field.string({
      default: '"pending"',
      description: 'Invitation status',
    }),
    acceptedAt: field.dateTime({ isOptional: true }),
    expiresAt: field.dateTime({ isOptional: true }),
    inviterId: field.foreignKey({
      description: 'User who sent the invitation',
    }),
    teamId: field.string({ isOptional: true }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    organization: field.belongsTo('Organization', ['organizationId'], ['id'], {
      onDelete: 'Cascade',
    }),
    inviter: field.belongsTo('User', ['inviterId'], ['id'], {
      onDelete: 'Cascade',
    }),
    team: field.belongsTo('Team', ['teamId'], ['id'], { onDelete: 'Cascade' }),
  },
});

/**
 * Team entity - team within an organization.
 */
export const TeamEntity = defineEntity({
  name: 'Team',
  description: 'Team within an organization.',
  schema: 'lssm_sigil',
  map: 'team',
  fields: {
    id: field.id(),
    name: field.string({ description: 'Team name' }),
    organizationId: field.foreignKey(),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    organization: field.belongsTo('Organization', ['organizationId'], ['id'], {
      onDelete: 'Cascade',
    }),
    members: field.hasMany('TeamMember'),
    invitations: field.hasMany('Invitation'),
  },
});

/**
 * TeamMember entity - user's team membership.
 */
export const TeamMemberEntity = defineEntity({
  name: 'TeamMember',
  description: 'Team membership for a user.',
  schema: 'lssm_sigil',
  map: 'team_member',
  fields: {
    id: field.id(),
    teamId: field.foreignKey(),
    userId: field.foreignKey(),
    createdAt: field.createdAt(),

    // Relations
    team: field.belongsTo('Team', ['teamId'], ['id'], { onDelete: 'Cascade' }),
    user: field.belongsTo('User', ['userId'], ['id'], { onDelete: 'Cascade' }),
  },
});

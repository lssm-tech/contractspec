import { z } from 'zod';
import { defineEntity, field, index } from '@lssm/lib.schema';

/**
 * User entity - core user profile and authentication.
 */
export const UserEntity = defineEntity({
  name: 'User',
  description:
    'A user of the platform. Users hold core profile information and authenticate via Account records.',
  schema: 'lssm_sigil',
  map: 'user',
  fields: {
    id: field.id({ description: 'Unique user identifier' }),
    email: field.email({ isUnique: true, description: 'User email address' }),
    emailVerified: field.boolean({
      default: false,
      description: 'Whether email has been verified',
    }),
    name: field.string({ isOptional: true, description: 'Display name' }),
    firstName: field.string({ isOptional: true, description: 'First name' }),
    lastName: field.string({ isOptional: true, description: 'Last name' }),
    locale: field.string({
      isOptional: true,
      description: 'User locale (e.g., "en-US")',
    }),
    timezone: field.string({
      isOptional: true,
      description: 'Olson timezone (e.g., "Europe/Paris")',
    }),
    imageUrl: field.url({
      isOptional: true,
      description: 'URL of avatar or profile picture',
    }),
    image: field.string({
      isOptional: true,
      description: 'Legacy image field',
    }),
    metadata: field.json({
      isOptional: true,
      description: 'Arbitrary user metadata',
    }),

    // Onboarding
    onboardingCompleted: field.boolean({
      default: false,
      description: 'Whether onboarding is complete',
    }),
    onboardingStep: field.string({
      isOptional: true,
      description: 'Current onboarding step',
    }),
    whitelistedAt: field.dateTime({
      isOptional: true,
      description: 'When user was whitelisted',
    }),

    // Admin fields
    role: field.string({
      isOptional: true,
      default: '"user"',
      description: 'User role (user, admin)',
    }),
    banned: field.boolean({
      default: false,
      description: 'Whether user is banned',
    }),
    banReason: field.string({
      isOptional: true,
      description: 'Reason for ban',
    }),
    banExpires: field.dateTime({
      isOptional: true,
      description: 'When ban expires',
    }),

    // Phone authentication
    phoneNumber: field.string({
      isOptional: true,
      isUnique: true,
      description: 'Phone number',
    }),
    phoneNumberVerified: field.boolean({
      default: false,
      description: 'Whether phone is verified',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    sessions: field.hasMany('Session'),
    accounts: field.hasMany('Account'),
    memberships: field.hasMany('Member'),
    invitations: field.hasMany('Invitation'),
    teamMemberships: field.hasMany('TeamMember'),
    policyBindings: field.hasMany('PolicyBinding'),
    apiKeys: field.hasMany('ApiKey'),
    passkeys: field.hasMany('Passkey'),
  },
});

/**
 * Session entity - login sessions.
 */
export const SessionEntity = defineEntity({
  name: 'Session',
  description: 'Represents a login session (e.g., web session or API token).',
  schema: 'lssm_sigil',
  map: 'session',
  fields: {
    id: field.id(),
    userId: field.foreignKey(),
    expiresAt: field.dateTime({ description: 'Session expiration time' }),
    token: field.string({ isUnique: true, description: 'Session token' }),
    ipAddress: field.string({
      isOptional: true,
      description: 'Client IP address',
    }),
    userAgent: field.string({
      isOptional: true,
      description: 'Client user agent',
    }),
    impersonatedBy: field.string({
      isOptional: true,
      description: 'Admin impersonating this session',
    }),
    activeOrganizationId: field.string({
      isOptional: true,
      description: 'Active org context',
    }),
    activeTeamId: field.string({
      isOptional: true,
      description: 'Active team context',
    }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    user: field.belongsTo('User', ['userId'], ['id'], { onDelete: 'Cascade' }),
  },
});

/**
 * Account entity - external authentication accounts.
 */
export const AccountEntity = defineEntity({
  name: 'Account',
  description: 'External authentication accounts (OAuth, password, etc.).',
  schema: 'lssm_sigil',
  map: 'account',
  fields: {
    id: field.id(),
    accountId: field.string({ description: 'Account ID from provider' }),
    providerId: field.string({ description: 'Provider identifier' }),
    userId: field.foreignKey(),
    accessToken: field.string({ isOptional: true }),
    refreshToken: field.string({ isOptional: true }),
    idToken: field.string({ isOptional: true }),
    accessTokenExpiresAt: field.dateTime({ isOptional: true }),
    refreshTokenExpiresAt: field.dateTime({ isOptional: true }),
    scope: field.string({ isOptional: true }),
    password: field.string({
      isOptional: true,
      description: 'Hashed password for password providers',
    }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    user: field.belongsTo('User', ['userId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [index.unique(['accountId', 'providerId'])],
});

/**
 * Verification entity - email/phone verification tokens.
 */
export const VerificationEntity = defineEntity({
  name: 'Verification',
  description: 'Verification tokens for email/phone confirmation.',
  schema: 'lssm_sigil',
  map: 'verification',
  fields: {
    id: field.uuid(),
    identifier: field.string({ description: 'Email or phone being verified' }),
    value: field.string({ description: 'Verification code/token' }),
    expiresAt: field.dateTime({ description: 'Token expiration' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
});

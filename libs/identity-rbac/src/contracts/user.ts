import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineCommand, defineQuery } from '@contractspec/lib.contracts';

const OWNERS = ['platform.identity-rbac'] as const;

// ============ SchemaModels ============

export const UserProfileModel = new SchemaModel({
  name: 'UserProfile',
  description: 'User profile information',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    emailVerified: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    firstName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    lastName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    locale: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timezone: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    imageUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    onboardingCompleted: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateUserInputModel = new SchemaModel({
  name: 'CreateUserInput',
  description: 'Input for creating a new user',
  fields: {
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    firstName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    lastName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    password: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const UpdateUserInputModel = new SchemaModel({
  name: 'UpdateUserInput',
  description: 'Input for updating a user profile',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    firstName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    lastName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    locale: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timezone: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    imageUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
  },
});

export const DeleteUserInputModel = new SchemaModel({
  name: 'DeleteUserInput',
  description: 'Input for deleting a user',
  fields: {
    confirmEmail: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
  },
});

export const SuccessResultModel = new SchemaModel({
  name: 'SuccessResult',
  description: 'Simple success result',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const UserDeletedPayloadModel = new SchemaModel({
  name: 'UserDeletedPayload',
  description: 'Payload for user deleted event',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListUsersInputModel = new SchemaModel({
  name: 'ListUsersInput',
  description: 'Input for listing users',
  fields: {
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ListUsersOutputModel = new SchemaModel({
  name: 'ListUsersOutput',
  description: 'Output for listing users',
  fields: {
    users: { type: UserProfileModel, isOptional: false, isArray: true },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Create a new user account.
 */
export const CreateUserContract = defineCommand({
  meta: {
    key: 'identity.user.create',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'user', 'create'],
    description: 'Create a new user account.',
    goal: 'Register a new user in the system.',
    context: 'Used during signup flows. May trigger email verification.',
  },
  io: {
    input: CreateUserInputModel,
    output: UserProfileModel,
    errors: {
      EMAIL_EXISTS: {
        description: 'A user with this email already exists',
        http: 409,
        gqlCode: 'EMAIL_EXISTS',
        when: 'Email is already registered',
      },
    },
  },
  policy: {
    auth: 'anonymous',
  },
  sideEffects: {
    emits: [
      {
        key: 'user.created',
        version: '1.0.0',
        when: 'User is successfully created',
        payload: UserProfileModel,
      },
    ],
    audit: ['user.created'],
  },
});

/**
 * Get the current user's profile.
 */
export const GetCurrentUserContract = defineQuery({
  meta: {
    key: 'identity.user.me',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'user', 'profile'],
    description: 'Get the current authenticated user profile.',
    goal: 'Retrieve user profile for the authenticated session.',
    context: 'Called on app load and after profile updates.',
  },
  io: {
    input: null,
    output: UserProfileModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Update user profile.
 */
export const UpdateUserContract = defineCommand({
  meta: {
    key: 'identity.user.update',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'user', 'update'],
    description: 'Update user profile information.',
    goal: 'Allow users to update their profile.',
    context: 'Self-service profile updates.',
  },
  io: {
    input: UpdateUserInputModel,
    output: UserProfileModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        key: 'user.updated',
        version: '1.0.0',
        when: 'User profile is updated',
        payload: UserProfileModel,
      },
    ],
    audit: ['user.updated'],
  },
});

/**
 * Delete user account.
 */
export const DeleteUserContract = defineCommand({
  meta: {
    key: 'identity.user.delete',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'user', 'delete'],
    description: 'Delete user account and all associated data.',
    goal: 'Allow users to delete their account (GDPR compliance).',
    context:
      'Self-service account deletion. Cascades to memberships, sessions, etc.',
  },
  io: {
    input: DeleteUserInputModel,
    output: SuccessResultModel,
  },
  policy: {
    auth: 'user',
    escalate: 'human_review',
  },
  sideEffects: {
    emits: [
      {
        key: 'user.deleted',
        version: '1.0.0',
        when: 'User account is deleted',
        payload: UserDeletedPayloadModel,
      },
    ],
    audit: ['user.deleted'],
  },
});

/**
 * List users (admin only).
 */
export const ListUsersContract = defineQuery({
  meta: {
    key: 'identity.user.list',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['identity', 'user', 'admin', 'list'],
    description: 'List all users (admin only).',
    goal: 'Allow admins to browse and manage users.',
    context: 'Admin dashboard user management.',
  },
  io: {
    input: ListUsersInputModel,
    output: ListUsersOutputModel,
  },
  policy: {
    auth: 'admin',
  },
});

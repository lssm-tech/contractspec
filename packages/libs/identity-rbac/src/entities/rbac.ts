import { defineEntity, field, index } from '@lssm/lib.schema';

/**
 * Role entity - named set of permissions.
 */
export const RoleEntity = defineEntity({
  name: 'Role',
  description: 'A role defines a named set of permissions.',
  schema: 'lssm_sigil',
  map: 'role',
  fields: {
    id: field.id(),
    name: field.string({ isUnique: true, description: 'Unique role name' }),
    description: field.string({
      isOptional: true,
      description: 'Role description',
    }),
    permissions: field.string({
      isArray: true,
      description: 'Array of permission names',
    }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    policyBindings: field.hasMany('PolicyBinding'),
  },
});

/**
 * Permission entity - atomic access right.
 */
export const PermissionEntity = defineEntity({
  name: 'Permission',
  description: 'A permission represents an atomic access right.',
  schema: 'lssm_sigil',
  map: 'permission',
  fields: {
    id: field.id(),
    name: field.string({
      isUnique: true,
      description: 'Unique permission name',
    }),
    description: field.string({
      isOptional: true,
      description: 'Permission description',
    }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
});

/**
 * PolicyBinding entity - binds roles to principals.
 */
export const PolicyBindingEntity = defineEntity({
  name: 'PolicyBinding',
  description: 'Binds roles to principals (users or organizations).',
  schema: 'lssm_sigil',
  map: 'policy_binding',
  fields: {
    id: field.id(),
    roleId: field.foreignKey(),
    targetType: field.string({ description: '"user" or "organization"' }),
    targetId: field.string({ description: 'ID of User or Organization' }),
    expiresAt: field.dateTime({
      isOptional: true,
      description: 'When binding expires',
    }),
    createdAt: field.createdAt(),

    // Optional direct relations
    userId: field.string({ isOptional: true }),
    organizationId: field.string({ isOptional: true }),

    // Relations
    role: field.belongsTo('Role', ['roleId'], ['id'], { onDelete: 'Cascade' }),
    user: field.belongsTo('User', ['userId'], ['id']),
    organization: field.belongsTo('Organization', ['organizationId'], ['id']),
  },
  indexes: [index.on(['targetType', 'targetId'])],
});

/**
 * ApiKey entity - API keys for programmatic access.
 */
export const ApiKeyEntity = defineEntity({
  name: 'ApiKey',
  description: 'API keys for programmatic access.',
  schema: 'lssm_sigil',
  map: 'api_key',
  fields: {
    id: field.id(),
    name: field.string({ description: 'API key name' }),
    start: field.string({
      description: 'Starting characters for identification',
    }),
    prefix: field.string({ description: 'API key prefix' }),
    key: field.string({ description: 'Hashed API key' }),
    userId: field.foreignKey(),

    // Rate limiting
    refillInterval: field.int({ description: 'Refill interval in ms' }),
    refillAmount: field.int({ description: 'Amount to refill' }),
    lastRefillAt: field.dateTime(),
    remaining: field.int({ description: 'Remaining requests' }),
    requestCount: field.int({ description: 'Total requests made' }),
    lastRequest: field.dateTime(),

    // Limits
    enabled: field.boolean({ default: true }),
    rateLimitEnabled: field.boolean({ default: true }),
    rateLimitTimeWindow: field.int({ description: 'Rate limit window in ms' }),
    rateLimitMax: field.int({ description: 'Max requests in window' }),

    // Expiration
    expiresAt: field.dateTime(),

    // Permissions
    permissions: field.string({ isArray: true }),
    metadata: field.json({ isOptional: true }),

    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    user: field.belongsTo('User', ['userId'], ['id'], { onDelete: 'Cascade' }),
  },
});

/**
 * Passkey entity - WebAuthn passkeys.
 */
export const PasskeyEntity = defineEntity({
  name: 'Passkey',
  description: 'WebAuthn passkeys for passwordless authentication.',
  schema: 'lssm_sigil',
  map: 'passkey',
  fields: {
    id: field.id(),
    name: field.string({ description: 'Passkey name' }),
    publicKey: field.string({ description: 'Public key' }),
    userId: field.foreignKey(),
    credentialID: field.string({ description: 'Credential ID' }),
    counter: field.int({ description: 'Counter' }),
    deviceType: field.string({ description: 'Device type' }),
    backedUp: field.boolean({ description: 'Whether passkey is backed up' }),
    transports: field.string({ description: 'Transports' }),
    aaguid: field.string({ description: 'Authenticator GUID' }),
    createdAt: field.createdAt(),

    // Relations
    user: field.belongsTo('User', ['userId'], ['id'], { onDelete: 'Cascade' }),
  },
});

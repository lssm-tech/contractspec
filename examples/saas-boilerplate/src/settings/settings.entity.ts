import { defineEntity, field, index } from '@contractspec/lib.schema';
import { SettingsScopeEnum } from './settings.enum';

/**
 * Settings entity - key-value configuration store.
 */
export const SettingsEntity = defineEntity({
  name: 'Settings',
  description: 'Application, organization, or user settings.',
  schema: 'saas_app',
  map: 'settings',
  fields: {
    id: field.id(),

    // Key identification
    key: field.string({
      description: 'Setting key (e.g., "theme", "notifications.email")',
    }),

    // Scope
    scope: field.enum('SettingsScope'),
    scopeId: field.string({
      isOptional: true,
      description: 'ID of scoped entity (org, user, project)',
    }),

    // Value
    value: field.json({ description: 'Setting value' }),
    valueType: field.string({
      default: '"string"',
      description: 'Type hint for value',
    }),

    // Schema
    schema: field.json({
      isOptional: true,
      description: 'JSON schema for validation',
    }),

    // Metadata
    description: field.string({ isOptional: true }),
    isSecret: field.boolean({
      default: false,
      description: 'Whether value should be encrypted',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  indexes: [
    index.unique(['scope', 'scopeId', 'key']),
    index.on(['scope', 'key']),
  ],
  enums: [SettingsScopeEnum],
});

/**
 * FeatureFlag entity - feature toggles.
 */
export const FeatureFlagEntity = defineEntity({
  name: 'FeatureFlag',
  description: 'Feature flags for progressive rollout.',
  schema: 'saas_app',
  map: 'feature_flag',
  fields: {
    id: field.id(),
    key: field.string({ isUnique: true, description: 'Feature flag key' }),
    name: field.string({ description: 'Human-readable name' }),
    description: field.string({ isOptional: true }),

    // Status
    enabled: field.boolean({ default: false }),

    // Targeting
    defaultValue: field.boolean({ default: false }),
    rules: field.json({ isOptional: true, description: 'Targeting rules' }),

    // Rollout
    rolloutPercentage: field.int({
      default: 0,
      description: 'Percentage rollout (0-100)',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
});

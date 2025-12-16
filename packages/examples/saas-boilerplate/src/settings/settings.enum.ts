import { defineEntityEnum } from '@lssm/lib.schema';

/**
 * Settings scope enum.
 */
export const SettingsScopeEnum = defineEntityEnum({
  name: 'SettingsScope',
  values: ['APP', 'ORG', 'USER', 'PROJECT'] as const,
  schema: 'saas_app',
  description: 'Scope of a setting.',
});

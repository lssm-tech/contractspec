// Project entities
export {
  ProjectStatusEnum,
  ProjectEntity,
  ProjectMemberEntity,
} from './project';

// Settings entities
export {
  SettingsScopeEnum,
  SettingsEntity,
  FeatureFlagEntity,
} from './settings';

// Billing entities
export {
  SubscriptionStatusEnum,
  SubscriptionEntity,
  BillingUsageEntity,
  UsageLimitEntity,
} from './billing';

// Re-export identity-rbac entities for convenience
export {
  identityRbacSchemaContribution,
  identityRbacEntities,
} from '@lssm/lib.identity-rbac';

// Schema contribution
import {
  ProjectEntity,
  ProjectMemberEntity,
  ProjectStatusEnum,
} from './project';
import {
  SettingsEntity,
  FeatureFlagEntity,
  SettingsScopeEnum,
} from './settings';
import {
  SubscriptionEntity,
  BillingUsageEntity,
  UsageLimitEntity,
  SubscriptionStatusEnum,
} from './billing';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

export const saasBoilerplateEntities = [
  ProjectEntity,
  ProjectMemberEntity,
  SettingsEntity,
  FeatureFlagEntity,
  SubscriptionEntity,
  BillingUsageEntity,
  UsageLimitEntity,
];

export const saasBoilerplateSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/example.saas-boilerplate',
  entities: saasBoilerplateEntities,
  enums: [ProjectStatusEnum, SettingsScopeEnum, SubscriptionStatusEnum],
};

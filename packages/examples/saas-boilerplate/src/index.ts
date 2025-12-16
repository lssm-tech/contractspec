// SaaS Boilerplate Example
// Demonstrates ContractSpec principles for a complete SaaS application

// Export all domain modules
export * from './billing';
export * from './project';
export * from './settings';
export * from './dashboard';

// Export feature and example metadata
export * from './saas.feature';
export { default as example } from './example';

// Import docs for registration
import './docs';

// Schema composition configuration
import { identityRbacSchemaContribution } from '@lssm/lib.identity-rbac';
import { jobsSchemaContribution } from '@lssm/lib.jobs';
import { auditTrailSchemaContribution } from '@lssm/module.audit-trail';
import { notificationsSchemaContribution } from '@lssm/module.notifications';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';
import {
  ProjectEntity,
  ProjectMemberEntity,
  ProjectStatusEnum,
} from './project/project.entity';
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
} from './billing/billing.entity';

/**
 * SaaS boilerplate schema contribution.
 */
export const saasBoilerplateSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/example.saas-boilerplate',
  entities: [
    ProjectEntity,
    ProjectMemberEntity,
    SettingsEntity,
    FeatureFlagEntity,
    SubscriptionEntity,
    BillingUsageEntity,
    UsageLimitEntity,
  ],
  enums: [ProjectStatusEnum, SettingsScopeEnum, SubscriptionStatusEnum],
};

/**
 * Complete schema composition for SaaS Boilerplate.
 * Use with `database schema:compose` to generate Prisma schema.
 */
export const schemaComposition = {
  modules: [
    identityRbacSchemaContribution,
    jobsSchemaContribution,
    auditTrailSchemaContribution,
    notificationsSchemaContribution,
    saasBoilerplateSchemaContribution,
  ],
  provider: 'postgresql' as const,
  outputPath: './prisma/schema/generated.prisma',
};

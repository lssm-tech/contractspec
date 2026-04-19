// SaaS Boilerplate Example
// Demonstrates ContractSpec principles for a complete SaaS application

// Export all domain modules
export * from './billing';
export * from './dashboard';
export { default as example } from './example';
export {
	createSaasHandlers,
	type SaasHandlers,
} from './handlers/saas.handlers';
export * from './project';
// Export feature and example metadata
export * from './saas-boilerplate.feature';
export * from './settings';
export * from './ui';
export * from './visualizations';

// Import docs for registration
import './docs';

// Schema composition configuration
import { identityRbacSchemaContribution } from '@contractspec/lib.identity-rbac';
import { jobsSchemaContribution } from '@contractspec/lib.jobs';
import type { ModuleSchemaContribution } from '@contractspec/lib.schema';
import { auditTrailSchemaContribution } from '@contractspec/module.audit-trail';
import { notificationsSchemaContribution } from '@contractspec/module.notifications';
import {
	BillingUsageEntity,
	SubscriptionEntity,
	SubscriptionStatusEnum,
	UsageLimitEntity,
} from './billing/billing.entity';
import {
	ProjectEntity,
	ProjectMemberEntity,
	ProjectStatusEnum,
} from './project/project.entity';
import {
	FeatureFlagEntity,
	SettingsEntity,
	SettingsScopeEnum,
} from './settings';

/**
 * SaaS boilerplate schema contribution.
 */
export const saasBoilerplateSchemaContribution: ModuleSchemaContribution = {
	moduleId: '@contractspec/example.saas-boilerplate',
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
export * from './example';

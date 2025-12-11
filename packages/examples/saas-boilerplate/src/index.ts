// SaaS Boilerplate Example
// Demonstrates ContractSpec principles for a complete SaaS application

export * from './entities';
export * from './contracts';
export * from './events';
export * from './handlers';
export * from './presentations';
export * from './feature';
import './docs';

// Schema composition configuration
import { identityRbacSchemaContribution } from '@lssm/lib.identity-rbac';
import { jobsSchemaContribution } from '@lssm/lib.jobs';
import { auditTrailSchemaContribution } from '@lssm/module.audit-trail';
import { notificationsSchemaContribution } from '@lssm/module.notifications';
import { saasBoilerplateSchemaContribution } from './entities';

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

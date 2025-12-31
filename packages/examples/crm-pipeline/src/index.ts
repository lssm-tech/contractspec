// CRM Pipeline Example
// Demonstrates ContractSpec principles for a CRM application

export * from './entities';
export * from './operations';
export * from './events';
export * from './handlers';
export * from './presentations';
export * from './ui';
export * from './crm-pipeline.feature';
export { default as example } from './example';
import './docs';

// Schema composition configuration
import { identityRbacSchemaContribution } from '@contractspec/lib.identity-rbac';
import { auditTrailSchemaContribution } from '@contractspec/module.audit-trail';
import { notificationsSchemaContribution } from '@contractspec/module.notifications';
import { crmPipelineSchemaContribution } from './entities';

/**
 * Complete schema composition for CRM Pipeline.
 */
export const schemaComposition = {
  modules: [
    identityRbacSchemaContribution,
    auditTrailSchemaContribution,
    notificationsSchemaContribution,
    crmPipelineSchemaContribution,
  ],
  provider: 'postgresql' as const,
  outputPath: './prisma/schema/generated.prisma',
};

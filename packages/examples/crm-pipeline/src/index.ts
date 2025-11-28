// CRM Pipeline Example
// Demonstrates ContractSpec principles for a CRM application

export * from './entities';
export * from './contracts';
export * from './events';
export * from './handlers';
export * from './presentations';
export * from './feature';

// Schema composition configuration
import { identityRbacSchemaContribution } from '@lssm/lib.identity-rbac';
import { auditTrailSchemaContribution } from '@lssm/module.audit-trail';
import { notificationsSchemaContribution } from '@lssm/module.notifications';
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


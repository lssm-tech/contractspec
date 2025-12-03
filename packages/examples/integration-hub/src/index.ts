// Integration Hub Example
// Demonstrates ContractSpec principles for data integration and sync

export * from './entities';
export * from './contracts';
export * from './events';
export * from './handlers';
export * from './presentations';
export * from './sync-engine';
export * from './feature';

// Schema composition configuration
import { identityRbacSchemaContribution } from '@lssm/lib.identity-rbac';
import { auditTrailSchemaContribution } from '@lssm/module.audit-trail';
import { featureFlagsSchemaContribution } from '@lssm/lib.feature-flags';
import { filesSchemaContribution } from '@lssm/lib.files';
import { jobsSchemaContribution } from '@lssm/lib.jobs';
import { integrationHubSchemaContribution } from './entities';

/**
 * Complete schema composition for Integration Hub.
 *
 * This example demonstrates:
 * - Integration connectors with OAuth and API key auth
 * - Bidirectional data synchronization
 * - Configurable field mappings with transforms
 * - Scheduled and manual sync execution
 * - Sync history and logging
 * - Change detection with checksums
 * - Feature flag controlled rollout
 */
export const schemaComposition = {
  modules: [
    identityRbacSchemaContribution,
    auditTrailSchemaContribution,
    featureFlagsSchemaContribution,
    filesSchemaContribution,
    jobsSchemaContribution,
    integrationHubSchemaContribution,
  ],
  provider: 'postgresql' as const,
  outputPath: './prisma/schema/generated.prisma',
};



// Workflow System Example
// Demonstrates ContractSpec principles for workflow and approval management

export * from './entities';
export * from './contracts';
export * from './events';
export * from './handlers';
export * from './presentations';
export * from './state-machine';
export * from './feature';
export { default as example } from './example';
import './docs';

// Schema composition configuration
import { identityRbacSchemaContribution } from '@lssm/lib.identity-rbac';
import { auditTrailSchemaContribution } from '@lssm/module.audit-trail';
import { notificationsSchemaContribution } from '@lssm/module.notifications';
import { featureFlagsSchemaContribution } from '@lssm/lib.feature-flags';
import { workflowSystemSchemaContribution } from './entities';

/**
 * Complete schema composition for Workflow System.
 *
 * This example demonstrates:
 * - State machine-based workflow execution
 * - Role-based approval chains
 * - Delegation and escalation
 * - Integration with feature flags for controlled rollout
 * - Full audit trail of all workflow actions
 * - Notifications for approval requests
 */
export const schemaComposition = {
  modules: [
    identityRbacSchemaContribution,
    auditTrailSchemaContribution,
    notificationsSchemaContribution,
    featureFlagsSchemaContribution,
    workflowSystemSchemaContribution,
  ],
  provider: 'postgresql' as const,
  outputPath: './prisma/schema/generated.prisma',
};

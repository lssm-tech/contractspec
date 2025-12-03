// Marketplace Example
// Demonstrates ContractSpec principles for a multi-vendor marketplace

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
import { filesSchemaContribution } from '@lssm/lib.files';
import { meteringSchemaContribution } from '@lssm/lib.metering';
import { marketplaceSchemaContribution } from './entities';

/**
 * Complete schema composition for Marketplace.
 *
 * This example demonstrates:
 * - Multi-vendor store management
 * - Product catalog with variants and categories
 * - Order processing with fulfillment workflow
 * - Commission calculation and seller payouts
 * - Customer reviews and ratings
 * - File attachments for product images
 * - Usage metering for platform analytics
 */
export const schemaComposition = {
  modules: [
    identityRbacSchemaContribution,
    auditTrailSchemaContribution,
    notificationsSchemaContribution,
    filesSchemaContribution,
    meteringSchemaContribution,
    marketplaceSchemaContribution,
  ],
  provider: 'postgresql' as const,
  outputPath: './prisma/schema/generated.prisma',
};



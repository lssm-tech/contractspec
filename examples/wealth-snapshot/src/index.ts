export * from './entities';
export * from './operations';
export * from './events';
export * from './presentations';
export * from './wealth-snapshot.feature';
export * from './handlers';
export { default as example } from './example';
import './docs';

import { identityRbacSchemaContribution } from '@contractspec/lib.identity-rbac';
import { auditTrailSchemaContribution } from '@contractspec/module.audit-trail';
import { notificationsSchemaContribution } from '@contractspec/module.notifications';
import { wealthSnapshotSchemaContribution } from './entities';

export const schemaComposition = {
  modules: [
    identityRbacSchemaContribution,
    auditTrailSchemaContribution,
    notificationsSchemaContribution,
    wealthSnapshotSchemaContribution,
  ],
  provider: 'postgresql' as const,
  outputPath: './prisma/schema/generated.prisma',
};

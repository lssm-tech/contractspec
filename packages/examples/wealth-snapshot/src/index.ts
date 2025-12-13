export * from './entities';
export * from './contracts';
export * from './events';
export * from './presentations';
export * from './feature';
export * from './handlers';
export { default as example } from './example';
import './docs';

import { identityRbacSchemaContribution } from '@lssm/lib.identity-rbac';
import { auditTrailSchemaContribution } from '@lssm/module.audit-trail';
import { notificationsSchemaContribution } from '@lssm/module.notifications';
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

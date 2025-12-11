export * from './entities';
export * from './contracts';
export * from './events';
export * from './presentations';
export * from './feature';
export * from './handlers';
import './docs';

import { identityRbacSchemaContribution } from '@lssm/lib.identity-rbac';
import { auditTrailSchemaContribution } from '@lssm/module.audit-trail';
import { notificationsSchemaContribution } from '@lssm/module.notifications';
import { jobsSchemaContribution } from '@lssm/lib.jobs';
import { teamHubSchemaContribution } from './entities';

export const schemaComposition = {
  modules: [
    identityRbacSchemaContribution,
    auditTrailSchemaContribution,
    notificationsSchemaContribution,
    jobsSchemaContribution,
    teamHubSchemaContribution,
  ],
  provider: 'postgresql' as const,
  outputPath: './prisma/schema/generated.prisma',
};

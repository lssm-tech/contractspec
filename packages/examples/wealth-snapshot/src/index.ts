export * from './entities';
export * from './events';
export { default as example } from './example';
export * from './handlers';
export * from './operations';
export * from './presentations';
export * from './ui';
export * from './wealth-snapshot.feature';
import './docs';

import { identityRbacSchemaContribution } from '@contractspec/lib.identity-rbac';
import { auditTrailSchemaContribution } from '@contractspec/module.audit-trail';
import { notificationsSchemaContribution } from '@contractspec/lib.notification';
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
export * from './example';

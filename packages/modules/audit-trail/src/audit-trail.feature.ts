import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const AuditTrailFeature = defineFeature({
	meta: {
		key: 'modules.audit-trail',
		version: '1.0.0',
		title: 'Audit Trail',
		description: 'Audit trail module for tracking and querying system events',
		domain: 'audit-trail',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'audit-trail'],
		stability: 'experimental',
	},
	operations: [
		{ key: 'audit.logs.query', version: '1.0.0' },
		{ key: 'audit.logs.get', version: '1.0.0' },
		{ key: 'audit.trace.get', version: '1.0.0' },
		{ key: 'audit.logs.export', version: '1.0.0' },
		{ key: 'audit.stats', version: '1.0.0' },
	],
});

import { defineFeature } from '../features';
import { PWA_DOMAIN, PWA_OWNERS, PWA_STABILITY, PWA_TAGS } from './constants';

export const PwaUpdateManagementFeature = defineFeature({
	meta: {
		key: 'pwa.update-management',
		version: '1.0.0',
		title: 'PWA Update Management',
		description:
			'Contracts for frontend update checks, blocking update policy, and update prompt telemetry.',
		domain: PWA_DOMAIN,
		owners: PWA_OWNERS,
		tags: PWA_TAGS,
		stability: PWA_STABILITY,
	},
	operations: [{ key: 'pwa.update.check', version: '1.0.0' }],
	events: [
		{ key: 'pwa.update.prompted', version: '1.0.0' },
		{ key: 'pwa.update.applied', version: '1.0.0' },
		{ key: 'pwa.update.deferred', version: '1.0.0' },
	],
	capabilities: {
		provides: [{ key: 'pwa.update-management', version: '1.0.0' }],
	},
	docs: ['docs.tech.contracts.pwa-updates'],
});

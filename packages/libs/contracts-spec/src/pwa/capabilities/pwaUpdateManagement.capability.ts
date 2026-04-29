import { defineCapability } from '../../capabilities';
import { PWA_DOMAIN, PWA_OWNERS, PWA_STABILITY, PWA_TAGS } from '../constants';

export const PwaUpdateManagementCapability = defineCapability({
	meta: {
		key: 'pwa.update-management',
		version: '1.0.0',
		kind: 'api',
		title: 'PWA Update Management',
		description:
			'Frontend update checks and update prompt telemetry for PWA runtimes.',
		domain: PWA_DOMAIN,
		owners: PWA_OWNERS,
		tags: [...PWA_TAGS, 'capability'],
		stability: PWA_STABILITY,
	},
	provides: [
		{
			surface: 'operation',
			key: 'pwa.update.check',
			version: '1.0.0',
			description: 'Check whether a PWA frontend should update.',
		},
		{
			surface: 'event',
			key: 'pwa.update.prompted',
			version: '1.0.0',
			description: 'Frontend update prompt displayed.',
		},
		{
			surface: 'event',
			key: 'pwa.update.applied',
			version: '1.0.0',
			description: 'Frontend update applied.',
		},
		{
			surface: 'event',
			key: 'pwa.update.deferred',
			version: '1.0.0',
			description: 'Optional frontend update deferred.',
		},
	],
});

import { defineFeature } from '../features';
import { NotificationOperationRefs } from './contracts';

export const NotificationsFeature = defineFeature({
	meta: {
		key: 'libs.notifications',
		version: '1.0.0',
		title: 'Notifications',
		description:
			'Notification contract operations for user notification flows.',
		domain: 'platform',
		owners: ['platform.notifications'],
		tags: ['notifications'],
		stability: 'stable',
	},
	operations: [...NotificationOperationRefs],
	events: [],
	presentations: [],
	opToPresentation: [],
	presentationsTargets: [],
	capabilities: {
		provides: [{ key: 'notifications', version: '1.0.0' }],
		requires: [{ key: 'identity', version: '1.0.0' }],
	},
});

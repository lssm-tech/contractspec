import { defineCapability } from '../capabilities';
import { StabilityEnum } from '../ownership';
import { NotificationOperationRefs } from './contracts';

export const NotificationsCapability = defineCapability({
	meta: {
		key: 'notifications',
		version: '1.0.0',
		title: 'Notifications Capability',
		description: 'Provides user notification contract operations.',
		domain: 'platform',
		owners: ['platform.notifications'],
		tags: ['notifications'],
		kind: 'api',
		stability: StabilityEnum.Stable,
	},
	provides: NotificationOperationRefs.map((operation) => ({
		surface: 'operation',
		key: operation.key,
		version: operation.version,
	})),
	requires: [{ key: 'identity', version: '1.0.0' }],
});

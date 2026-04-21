import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const NotificationsFeature = defineFeature({
	meta: {
		key: 'modules.notifications',
		version: '1.0.0',
		title: 'Notifications',
		description: 'Notification center module for ContractSpec applications',
		domain: 'notifications',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'notifications'],
		stability: 'experimental',
	},
	operations: [
		{ key: 'notifications.send', version: '1.0.0' },
		{ key: 'notifications.list', version: '1.0.0' },
		{ key: 'notifications.markRead', version: '1.0.0' },
		{ key: 'notifications.markAllRead', version: '1.0.0' },
		{ key: 'notifications.preferences.get', version: '1.0.0' },
		{ key: 'notifications.preferences.update', version: '1.0.0' },
		{ key: 'notifications.delete', version: '1.0.0' },
	],
});

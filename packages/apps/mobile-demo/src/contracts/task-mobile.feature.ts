import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const TaskMobileFeature = defineFeature({
	meta: {
		key: 'mobile-demo.tasks',
		version: '1.0.0',
		title: 'Mobile Demo Tasks',
		description:
			'Task-list demo feature for the Expo app, covering list, create, and status updates.',
		domain: 'mobile-demo',
		owners: ['@platform.core'],
		tags: ['mobile', 'tasks', 'expo', 'example'],
		stability: 'experimental',
	},

	operations: [
		{ key: 'task.list', version: '1.0.0' },
		{ key: 'task.create', version: '1.0.0' },
		{ key: 'task.updateStatus', version: '1.0.0' },
	],
});

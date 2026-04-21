import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const MessagingAgentActionsFeature = defineFeature({
	meta: {
		key: 'messaging-agent-actions',
		version: '1.0.0',
		title: 'Messaging Agent Actions',
		description:
			'Safe messaging automation with fixed intents, allowlisted actions, and workflow dispatch.',
		domain: 'messaging',
		owners: ['@platform.messaging'],
		tags: ['messaging', 'agents', 'actions', 'workflow'],
		stability: 'beta',
	},
	operations: [{ key: 'messaging.agentActions.process', version: '1.0.0' }],
	docs: [
		'docs.examples.messaging-agent-actions',
		'docs.examples.messaging-agent-actions.goal',
		'docs.examples.messaging-agent-actions.usage',
	],
});

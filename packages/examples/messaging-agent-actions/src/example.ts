import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesMessagingAgentActionsExample = defineExample({
	meta: {
		key: 'messaging-agent-actions',
		version: '1.0.0',
		title: 'Messaging Agent Actions',
		description:
			'Safe messaging agent actions example with fixed intents, allowlisted actions, workflow dispatch, and deterministic replies.',
		kind: 'template',
		visibility: 'public',
		stability: 'beta',
		owners: ['@contractspec-core'],
		tags: [
			'package',
			'examples',
			'messaging-agent-actions',
			'agents',
			'telegram',
		],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.messaging-agent-actions',
	},
});

export default ExamplesMessagingAgentActionsExample;
export { ExamplesMessagingAgentActionsExample };

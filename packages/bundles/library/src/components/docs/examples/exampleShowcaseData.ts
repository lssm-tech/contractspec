export interface ExampleShowcaseData {
	key:
		| 'agent-console'
		| 'ai-chat-assistant'
		| 'messaging-agent-actions';
	lead: string;
	sandboxHref: string;
	referenceHref: string;
	llmsHref: string;
	repoHref: string;
	localCommands: string;
}

const EXAMPLE_SHOWCASES: Record<string, ExampleShowcaseData> = {
	'agent-console': {
		key: 'agent-console',
		lead:
			'Primary meetup path for autonomous agents: typed tools, agent configs, run history, and execution logs in one regenerable surface.',
		sandboxHref: '/sandbox?template=agent-console',
		referenceHref: '/docs/reference/agent-console/agent-console',
		llmsHref: '/llms/example.agent-console',
		repoHref:
			'https://github.com/lssm-tech/contractspec/tree/main/packages/examples/agent-console',
		localCommands: `bun run --cwd packages/examples/agent-console build
bun run --cwd packages/examples/agent-console test
bun run --cwd packages/apps/web-landing dev

# Open in the browser
# http://localhost:3000/sandbox?template=agent-console`,
	},
	'ai-chat-assistant': {
		key: 'ai-chat-assistant',
		lead:
			'Secondary meetup path for MCP-aware assistants: reasoning, sources, suggestions, and a minimal contract-backed search tool.',
		sandboxHref: '/sandbox?template=ai-chat-assistant',
		referenceHref: '/docs/reference/ai-chat-assistant/assistant.search',
		llmsHref: '/llms/example.ai-chat-assistant',
		repoHref:
			'https://github.com/lssm-tech/contractspec/tree/main/packages/examples/ai-chat-assistant',
		localCommands: `bun run --cwd packages/examples/ai-chat-assistant build
bun run --cwd packages/examples/ai-chat-assistant test
bun run --cwd packages/apps/web-landing dev

# Open in the browser
# http://localhost:3000/sandbox?template=ai-chat-assistant`,
	},
	'messaging-agent-actions': {
		key: 'messaging-agent-actions',
		lead:
			'Live messaging lane for the meetup: inbound Slack, WhatsApp, or Telegram messages route through fixed intents, allowlisted actions, and deterministic confirmations.',
		sandboxHref: '/sandbox?template=messaging-agent-actions',
		referenceHref:
			'/docs/reference/messaging-agent-actions/messaging.agentActions.process',
		llmsHref: '/llms/example.messaging-agent-actions',
		repoHref:
			'https://github.com/lssm-tech/contractspec/tree/main/packages/examples/messaging-agent-actions',
		localCommands: `bun run --cwd packages/examples/messaging-agent-actions build
bun run --cwd packages/examples/messaging-agent-actions test
bun run --cwd packages/examples/messaging-agent-actions proof
bun run --cwd packages/apps/web-landing dev

# Open in the browser
# http://localhost:3000/sandbox?template=messaging-agent-actions`,
	},
};

export function getExampleShowcaseData(
	key: string
): ExampleShowcaseData | undefined {
	return EXAMPLE_SHOWCASES[key];
}

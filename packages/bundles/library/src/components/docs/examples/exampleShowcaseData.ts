import {
	buildExampleDocsHref,
	buildExampleReferenceHref,
	getDiscoverableExample,
	getExamplePreviewHref,
} from '@contractspec/module.examples/catalog';

export interface ExampleShowcaseData {
	key: string;
	lead: string;
	sandboxHref: string | null;
	referenceHref: string;
	llmsHref: string;
	repoHref: string;
	localCommands: string;
}

const LEAD_OVERRIDES: Record<string, string> = {
	'agent-console':
		'Primary meetup path for autonomous agents: typed tools, agent configs, run history, and execution logs in one regenerable surface.',
	'ai-chat-assistant':
		'Secondary meetup path for MCP-aware assistants: reasoning, sources, suggestions, and a minimal contract-backed search tool.',
	'data-grid-showcase':
		'Canonical table example for the full ContractSpec stack: declarative DataView contract, shared controller, raw web primitive, native-first primitive, and the composed design-system wrapper.',
	'messaging-agent-actions':
		'Live messaging lane for the meetup: inbound Slack, WhatsApp, or Telegram messages route through fixed intents, allowlisted actions, and deterministic confirmations.',
};

const REFERENCE_HREF_OVERRIDES: Record<string, string> = {
	'agent-console': '/docs/reference/agent-console/agent-console',
	'ai-chat-assistant': '/docs/reference/ai-chat-assistant/assistant.search',
	'data-grid-showcase': '/docs/reference/data-grid-showcase/data-grid-showcase',
	'messaging-agent-actions':
		'/docs/reference/messaging-agent-actions/messaging.agentActions.process',
};

export function getExampleShowcaseData(
	key: string
): ExampleShowcaseData | undefined {
	const example = getDiscoverableExample(key);

	if (!example) {
		return undefined;
	}

	const directory = example.entrypoints.packageName.replace(
		'@contractspec/example.',
		''
	);
	const docsHref = buildExampleDocsHref(key);
	const sandboxHref = getExamplePreviewHref(key);

	return {
		key,
		lead:
			LEAD_OVERRIDES[key] ??
			example.meta.summary ??
			example.meta.description ??
			'Public ContractSpec reference example.',
		sandboxHref,
		referenceHref:
			REFERENCE_HREF_OVERRIDES[key] ?? buildExampleReferenceHref(key),
		llmsHref: `/llms/${example.entrypoints.packageName.replace(
			'@contractspec/',
			''
		)}`,
		repoHref: `https://github.com/lssm-tech/contractspec/tree/main/packages/examples/${directory}`,
		localCommands: buildLocalCommands(directory, docsHref, sandboxHref),
	};
}

function buildLocalCommands(
	directory: string,
	docsHref: string,
	sandboxHref: string | null
): string {
	const lines = [
		`bun run --cwd packages/examples/${directory} build`,
		'bun run --cwd packages/apps/web-landing dev',
		'',
		'# Open in the browser',
		`# http://localhost:3000${docsHref}`,
	];

	if (sandboxHref) {
		lines.push(`# http://localhost:3000${sandboxHref}`);
	}

	return lines.join('\n');
}

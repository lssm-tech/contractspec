import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '../../registry';

export const tech_acp_transport_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.acp.transport',
		title: 'ACP transport',
		summary: 'Agent Client Protocol transport surfaces.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/acp/transport',
		tags: ['acp', 'transport'],
		body: `# ACP transport

Defines the ContractSpec ACP server + client surfaces for HTTP streamable transport.
`,
	},
	{
		id: 'docs.tech.acp.session.init',
		title: 'ACP session init',
		summary: 'Initialize a new ACP session.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/acp/session/init',
		tags: ['acp', 'session'],
		body: `# acp.session.init

Creates a new ACP session and returns session metadata.
`,
	},
	{
		id: 'docs.tech.acp.session.resume',
		title: 'ACP session resume',
		summary: 'Resume an existing ACP session.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/acp/session/resume',
		tags: ['acp', 'session'],
		body: `# acp.session.resume

Resumes a previously initialized ACP session.
`,
	},
	{
		id: 'docs.tech.acp.session.stop',
		title: 'ACP session stop',
		summary: 'Stop an ACP session.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/acp/session/stop',
		tags: ['acp', 'session'],
		body: `# acp.session.stop

Stops an active ACP session with audit trails.
`,
	},
	{
		id: 'docs.tech.acp.prompt.turn',
		title: 'ACP prompt turn',
		summary: 'Execute a prompt turn within a session.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/acp/prompt/turn',
		tags: ['acp', 'prompt'],
		body: `# acp.prompt.turn

Runs a prompt turn and returns structured outputs and tool calls.
`,
	},
	{
		id: 'docs.tech.acp.tool.calls',
		title: 'ACP tool calls',
		summary: 'Execute ACP tool calls.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/acp/tool/calls',
		tags: ['acp', 'tools'],
		body: `# acp.tool.calls

Executes tool calls with governance and telemetry.
`,
	},
	{
		id: 'docs.tech.acp.terminal.exec',
		title: 'ACP terminal exec',
		summary: 'Execute terminal commands via ACP.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/acp/terminal/exec',
		tags: ['acp', 'terminal'],
		body: `# acp.terminal.exec

Executes terminal commands in a governed ACP session.
`,
	},
	{
		id: 'docs.tech.acp.fs.access',
		title: 'ACP file system access',
		summary: 'Access file system through ACP.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/acp/fs/access',
		tags: ['acp', 'filesystem'],
		body: `# acp.fs.access

Performs file system access with policy gating.
`,
	},
];

registerDocBlocks(tech_acp_transport_DocBlocks);

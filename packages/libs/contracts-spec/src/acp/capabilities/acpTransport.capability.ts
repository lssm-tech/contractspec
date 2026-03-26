import { defineCapability } from '../../capabilities';
import { docRef } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

export const AcpTransportDocBlock = {
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
} satisfies DocBlock;

export const AcpTransportCapability = defineCapability({
	meta: {
		key: 'acp.transport',
		version: '1.0.0',
		kind: 'integration',
		title: 'ACP Transport',
		description: 'Agent Client Protocol transport surfaces.',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS, 'transport'],
		stability: ACP_STABILITY,
		docId: [docRef(AcpTransportDocBlock.id)],
	},
	provides: [
		{
			surface: 'operation',
			key: 'acp.session.init',
			version: '1.0.0',
			description: 'Initialize ACP session.',
		},
		{
			surface: 'operation',
			key: 'acp.session.resume',
			version: '1.0.0',
			description: 'Resume ACP session.',
		},
		{
			surface: 'operation',
			key: 'acp.session.stop',
			version: '1.0.0',
			description: 'Stop ACP session.',
		},
		{
			surface: 'operation',
			key: 'acp.prompt.turn',
			version: '1.0.0',
			description: 'Execute prompt turn.',
		},
		{
			surface: 'operation',
			key: 'acp.tool.calls',
			version: '1.0.0',
			description: 'Execute ACP tool calls.',
		},
		{
			surface: 'operation',
			key: 'acp.terminal.exec',
			version: '1.0.0',
			description: 'Execute terminal command.',
		},
		{
			surface: 'operation',
			key: 'acp.fs.access',
			version: '1.0.0',
			description: 'Access filesystem via ACP.',
		},
	],
});

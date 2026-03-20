import { defineCapability } from '../../capabilities';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

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
		docId: [docId('docs.tech.acp.transport')],
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

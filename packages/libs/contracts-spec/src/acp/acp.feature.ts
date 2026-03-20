import { defineFeature } from '../features';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from './constants';

export const AcpFeature = defineFeature({
	meta: {
		key: 'platform.acp',
		version: '1.0.0',
		title: 'Agent Communication Protocol',
		description:
			'Session management and transport operations for agent communication (prompt turns, tool calls, terminal exec, fs access)',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS],
		stability: ACP_STABILITY,
	},

	operations: [
		{ key: 'acp.session.init', version: '1.0.0' },
		{ key: 'acp.session.resume', version: '1.0.0' },
		{ key: 'acp.session.stop', version: '1.0.0' },
		{ key: 'acp.prompt.turn', version: '1.0.0' },
		{ key: 'acp.tool.calls', version: '1.0.0' },
		{ key: 'acp.terminal.exec', version: '1.0.0' },
		{ key: 'acp.fs.access', version: '1.0.0' },
	],

	capabilities: {
		provides: [{ key: 'acp.transport', version: '1.0.0' }],
	},
});

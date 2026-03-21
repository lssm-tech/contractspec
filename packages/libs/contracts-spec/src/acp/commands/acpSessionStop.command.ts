import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import type { DocBlock } from '../../docs/types';
import { docRef } from '../../docs/registry';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

const AcpSessionStopInput = new SchemaModel({
	name: 'AcpSessionStopInput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const AcpSessionStopOutput = new SchemaModel({
	name: 'AcpSessionStopOutput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		stoppedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const AcpSessionStopDocBlock = {
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
} satisfies DocBlock;

export const AcpSessionStopCommand = defineCommand({
	meta: {
		key: 'acp.session.stop',
		title: 'ACP Session Stop',
		version: '1.0.0',
		description: 'Stop an active ACP session.',
		goal: 'Terminate ACP sessions cleanly with audit trails.',
		context: 'Used by ACP clients to stop sessions explicitly.',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS, 'session'],
		stability: ACP_STABILITY,
		docId: [docRef(AcpSessionStopDocBlock.id)],
	},
	capability: {
		key: 'acp.transport',
		version: '1.0.0',
	},
	io: {
		input: AcpSessionStopInput,
		output: AcpSessionStopOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});

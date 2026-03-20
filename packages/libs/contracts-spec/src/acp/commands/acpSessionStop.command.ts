import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
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
		docId: [docId('docs.tech.acp.session.stop')],
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

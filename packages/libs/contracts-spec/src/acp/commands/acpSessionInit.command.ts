import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

const AcpSessionInitInput = new SchemaModel({
	name: 'AcpSessionInitInput',
	fields: {
		clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		sessionConfig: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		authContext: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

const AcpSessionInitOutput = new SchemaModel({
	name: 'AcpSessionInitOutput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		expiresAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const AcpSessionInitCommand = defineCommand({
	meta: {
		key: 'acp.session.init',
		title: 'ACP Session Init',
		version: '1.0.0',
		description: 'Initialize a new ACP session.',
		goal: 'Start a governed ACP session with configured tools and policies.',
		context:
			'Used by ACP clients to start a new session using HTTP streamable transport.',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS, 'session'],
		stability: ACP_STABILITY,
		docId: [docId('docs.tech.acp.session.init')],
	},
	capability: {
		key: 'acp.transport',
		version: '1.0.0',
	},
	io: {
		input: AcpSessionInitInput,
		output: AcpSessionInitOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});

import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docRef } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineCommand } from '../../operations';
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

export const AcpSessionInitDocBlock = {
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
} satisfies DocBlock;

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
		docId: [docRef(AcpSessionInitDocBlock.id)],
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

import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import type { DocBlock } from '../../docs/types';
import { docRef } from '../../docs/registry';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

const AcpSessionResumeInput = new SchemaModel({
	name: 'AcpSessionResumeInput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
	},
});

const AcpSessionResumeOutput = new SchemaModel({
	name: 'AcpSessionResumeOutput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

export const AcpSessionResumeDocBlock = {
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
} satisfies DocBlock;

export const AcpSessionResumeCommand = defineCommand({
	meta: {
		key: 'acp.session.resume',
		title: 'ACP Session Resume',
		version: '1.0.0',
		description: 'Resume an existing ACP session.',
		goal: 'Continue a previously initialized ACP session with full context.',
		context: 'Used by ACP clients to resume HTTP streamable sessions.',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS, 'session'],
		stability: ACP_STABILITY,
		docId: [docRef(AcpSessionResumeDocBlock.id)],
	},
	capability: {
		key: 'acp.transport',
		version: '1.0.0',
	},
	io: {
		input: AcpSessionResumeInput,
		output: AcpSessionResumeOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});

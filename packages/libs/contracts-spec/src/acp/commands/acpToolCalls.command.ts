import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docRef } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineCommand } from '../../operations';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

const AcpToolCallsInput = new SchemaModel({
	name: 'AcpToolCallsInput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
		toolCalls: {
			type: ScalarTypeEnum.JSONObject(),
			isOptional: false,
			isArray: true,
		},
	},
});

const AcpToolCallsOutput = new SchemaModel({
	name: 'AcpToolCallsOutput',
	fields: {
		results: {
			type: ScalarTypeEnum.JSONObject(),
			isOptional: false,
			isArray: true,
		},
	},
});

export const AcpToolCallsDocBlock = {
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
} satisfies DocBlock;

export const AcpToolCallsCommand = defineCommand({
	meta: {
		key: 'acp.tool.calls',
		title: 'ACP Tool Calls',
		version: '1.0.0',
		description: 'Execute tool calls within an ACP session.',
		goal: 'Run tool calls with safe governance and telemetry.',
		context: 'Used by ACP clients when the agent requests tool execution.',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS, 'tools'],
		stability: ACP_STABILITY,
		docId: [docRef(AcpToolCallsDocBlock.id)],
	},
	capability: {
		key: 'acp.transport',
		version: '1.0.0',
	},
	io: {
		input: AcpToolCallsInput,
		output: AcpToolCallsOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});

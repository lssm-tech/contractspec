import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

const AcpPromptTurnInput = new SchemaModel({
	name: 'AcpPromptTurnInput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
		messages: {
			type: ScalarTypeEnum.JSONObject(),
			isOptional: false,
			isArray: true,
		},
		options: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

const AcpPromptTurnOutput = new SchemaModel({
	name: 'AcpPromptTurnOutput',
	fields: {
		turnId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		output: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

export const AcpPromptTurnCommand = defineCommand({
	meta: {
		key: 'acp.prompt.turn',
		title: 'ACP Prompt Turn',
		version: '1.0.0',
		description: 'Execute a prompt turn within an ACP session.',
		goal: 'Run ACP prompt turns with tool calls and structured outputs.',
		context: 'Used by ACP clients to send messages and receive outputs.',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS, 'prompt'],
		stability: ACP_STABILITY,
		docId: [docId('docs.tech.acp.prompt.turn')],
	},
	capability: {
		key: 'acp.transport',
		version: '1.0.0',
	},
	io: {
		input: AcpPromptTurnInput,
		output: AcpPromptTurnOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});

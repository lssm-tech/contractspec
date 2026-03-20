import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

const AcpFsAccessInput = new SchemaModel({
	name: 'AcpFsAccessInput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
		operation: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		content: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		options: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

const AcpFsAccessOutput = new SchemaModel({
	name: 'AcpFsAccessOutput',
	fields: {
		result: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

export const AcpFsAccessCommand = defineCommand({
	meta: {
		key: 'acp.fs.access',
		title: 'ACP File System Access',
		version: '1.0.0',
		description: 'Perform file system access within an ACP session.',
		goal: 'Expose file system access through governed ACP transport.',
		context: 'Used by ACP clients for read/write/list operations.',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS, 'filesystem'],
		stability: ACP_STABILITY,
		docId: [docId('docs.tech.acp.fs.access')],
	},
	capability: {
		key: 'acp.transport',
		version: '1.0.0',
	},
	io: {
		input: AcpFsAccessInput,
		output: AcpFsAccessOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});

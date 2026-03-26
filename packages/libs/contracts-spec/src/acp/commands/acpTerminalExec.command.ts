import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docRef } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineCommand } from '../../operations';
import { ACP_DOMAIN, ACP_OWNERS, ACP_STABILITY, ACP_TAGS } from '../constants';

const AcpTerminalExecInput = new SchemaModel({
	name: 'AcpTerminalExecInput',
	fields: {
		sessionId: { type: ScalarTypeEnum.ID(), isOptional: false },
		command: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		cwd: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		env: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

const AcpTerminalExecOutput = new SchemaModel({
	name: 'AcpTerminalExecOutput',
	fields: {
		exitCode: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		stdout: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		stderr: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
	},
});

export const AcpTerminalExecDocBlock = {
	id: 'docs.tech.acp.terminal.exec',
	title: 'ACP terminal exec',
	summary: 'Execute terminal commands via ACP.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/acp/terminal/exec',
	tags: ['acp', 'terminal'],
	body: `# acp.terminal.exec

Executes terminal commands in a governed ACP session.
`,
} satisfies DocBlock;

export const AcpTerminalExecCommand = defineCommand({
	meta: {
		key: 'acp.terminal.exec',
		title: 'ACP Terminal Exec',
		version: '1.0.0',
		description: 'Execute a terminal command within an ACP session.',
		goal: 'Expose terminal execution with governance and auditing.',
		context: 'Used by ACP clients when terminal access is granted.',
		domain: ACP_DOMAIN,
		owners: ACP_OWNERS,
		tags: [...ACP_TAGS, 'terminal'],
		stability: ACP_STABILITY,
		docId: [docRef(AcpTerminalExecDocBlock.id)],
	},
	capability: {
		key: 'acp.transport',
		version: '1.0.0',
	},
	io: {
		input: AcpTerminalExecInput,
		output: AcpTerminalExecOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});

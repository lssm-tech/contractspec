import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
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
    docId: [docId('docs.tech.acp.terminal.exec')],
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

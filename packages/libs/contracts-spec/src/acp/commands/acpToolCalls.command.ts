import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
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
    docId: [docId('docs.tech.acp.tool.calls')],
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

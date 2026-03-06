import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
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
    docId: [docId('docs.tech.acp.session.resume')],
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

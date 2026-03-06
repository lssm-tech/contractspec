import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  AGENT_DOMAIN,
  AGENT_OWNERS,
  AGENT_STABILITY,
  AGENT_TAGS,
} from '../constants';

export const AgentRunStartedPayload = new SchemaModel({
  name: 'AgentRunStartedPayload',
  fields: {
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    agentKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    contextSnapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
  },
});

export const AgentRunStartedEvent = defineEvent({
  meta: {
    key: 'agent.run.started',
    version: '1.0.0',
    description: 'Emitted when an agent run starts executing.',
    domain: AGENT_DOMAIN,
    owners: AGENT_OWNERS,
    tags: [...AGENT_TAGS, 'run'],
    stability: AGENT_STABILITY,
    docId: [docId('docs.tech.agent.run.started')],
  },
  capability: {
    key: 'agent.execution',
    version: '1.0.0',
  },
  pii: [],
  payload: AgentRunStartedPayload,
});

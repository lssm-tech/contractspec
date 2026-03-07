import { defineCapability } from '../../capabilities';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  AGENT_DOMAIN,
  AGENT_OWNERS,
  AGENT_STABILITY,
  AGENT_TAGS,
} from '../constants';

export const AgentExecutionCapability = defineCapability({
  meta: {
    key: 'agent.execution',
    version: '1.0.0',
    kind: 'integration',
    title: 'Agent Execution',
    description: 'Background agent execution, approvals, and artifacts.',
    domain: AGENT_DOMAIN,
    owners: AGENT_OWNERS,
    tags: [...AGENT_TAGS, 'execution'],
    stability: AGENT_STABILITY,
    docId: [docId('docs.tech.agent.execution')],
  },
  provides: [
    {
      surface: 'operation',
      key: 'agent.run',
      version: '1.0.0',
      description: 'Submit an agent run.',
    },
    {
      surface: 'operation',
      key: 'agent.status',
      version: '1.0.0',
      description: 'Query agent run status.',
    },
    {
      surface: 'operation',
      key: 'agent.cancel',
      version: '1.0.0',
      description: 'Cancel an agent run.',
    },
    {
      surface: 'operation',
      key: 'agent.artifacts',
      version: '1.0.0',
      description: 'List agent artifacts.',
    },
    {
      surface: 'operation',
      key: 'agent.approvals',
      version: '1.0.0',
      description: 'Resolve an agent approval request.',
    },
    {
      surface: 'event',
      key: 'agent.run.started',
      version: '1.0.0',
      description: 'Agent run started event.',
    },
    {
      surface: 'event',
      key: 'agent.run.completed',
      version: '1.0.0',
      description: 'Agent run completed event.',
    },
    {
      surface: 'event',
      key: 'agent.run.failed',
      version: '1.0.0',
      description: 'Agent run failed event.',
    },
    {
      surface: 'event',
      key: 'agent.approval.requested',
      version: '1.0.0',
      description: 'Approval requested event.',
    },
    {
      surface: 'presentation',
      key: 'agent.run.audit',
      version: '1.0.0',
      description: 'Audit presentation for agent runs.',
    },
  ],
});

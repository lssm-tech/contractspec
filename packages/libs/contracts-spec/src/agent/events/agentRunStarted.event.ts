import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docId } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineEvent } from '../../events';
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

export const AgentRunStartedDocBlock = {
	id: 'docs.tech.agent.run.started',
	title: 'Agent run started event',
	summary: 'Emitted when an agent run starts.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/agent/run/started',
	tags: ['agent', 'event'],
	body: `# agent.run.started

Emitted when an agent run begins execution.
`,
} satisfies DocBlock;

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

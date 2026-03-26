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

export const AgentRunCompletedPayload = new SchemaModel({
	name: 'AgentRunCompletedPayload',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		agentKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		contextSnapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
	},
});

export const AgentRunCompletedDocBlock = {
	id: 'docs.tech.agent.run.completed',
	title: 'Agent run completed event',
	summary: 'Emitted when an agent run completes.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/agent/run/completed',
	tags: ['agent', 'event'],
	body: `# agent.run.completed

Emitted when a run completes successfully.
`,
} satisfies DocBlock;

export const AgentRunCompletedEvent = defineEvent({
	meta: {
		key: 'agent.run.completed',
		version: '1.0.0',
		description: 'Emitted when an agent run completes successfully.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'run'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.run.completed')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	pii: [],
	payload: AgentRunCompletedPayload,
});
